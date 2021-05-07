import * as azmaps from "azure-maps-control";
import { FullscreenControlOptions } from './FullscreenControlOptions';

/** The events supported by the `FullscreenControl`. */
export interface FullscreenControlEvents {
    /** Event fired when the fullscreen state changed. Returns a boolean indicating if the container is fullscreen or not. */
    fullscreenchanged: boolean;
}

/** A control that toggles the map or a specific container from its defined size to a fullscreen size. */
export class FullscreenControl extends azmaps.internal.EventEmitter<FullscreenControlEvents> implements azmaps.Control {

    /****************************
     * Private Properties
     ***************************/

    private _btnContainer: HTMLElement;
    private _button: HTMLButtonElement;
    private _options: FullscreenControlOptions = {
        style: 'light',
        hideIfUnsupported: true
    };
    private _hclStyle: azmaps.ControlStyle;
    private _darkColor = '#011c2c';
    private _map: azmaps.Map;

    /**
     * Resource values: 0 - Exit Fullscreen, 1 - View Fullscreen, 2 - Full Screen Control
     */
    private _resource: string[];
    private _container: HTMLElement;

    //TODO: consider converting images to SVGs for smaller file size.
    private static _fullscreenCss = '.azmaps-map-fullscreen-container:-webkit-full-screen{width:100%;height:100%;}.azmaps-map-fullscreen-container:-moz-full-screen{width:100%;height:100%;}.azmaps-map-fullscreen-container:-ms-fullscreen{width:100%;height:100%;}.azmaps-map-fullscreen-container:-o-full-screen{width:100%;height:100%;}.azmaps-map-fullscreen-container:-full-screen{width:100%;height:100%;}' +
        '.azmaps-map-fullscreen-btn{margin:0;padding:0;border:none;border-collapse:collapse;width:32px;height:32px;text-align:center;cursor:pointer;line-height:32px;background-repeat:no-repeat;background-size:20px;background-position:center center;z-index:200;box-shadow:0px 0px 4px rgba(0,0,0,0.16);}' +
        '.azmaps-map-fullscreen-expand{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAMAAAF6ePCOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAJacn5ean5idopicopicoZicoZbVOdIAAAAGdFJOUwBQYI+fucOe/hkAAAAJcEhZcwAAFxEAABcRAcom8z8AAADMSURBVDhPzZSNDoIwDITn397/kV27il9Rzmwq4Qux194VRmIombqqDzCvtV236LvRJos28rD6RlPGs5jpvHaZVTLWe0nEbCkxbnKkU4zcMw7xpvTqeHrho2WzzDfWHHPPmraCmAXWzRDrtZ7ZpCeNOe03c3xnL2bOdginc2Iz6/yYuDGxP+WG1Q8Qmvxxx6UGQUgNgpAaBCE1CEJqEITUIHhxXGquTjTHBa+mQRBSgyCkBkFIDYKQGgQhNQhCahDsMmGfoA1r351BSrkDTQQSzEhW2qYAAAAASUVORK5CYII=);}' +
        '.azmaps-map-fullscreen-expand:hover{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAMAAAF6ePCOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAADCszDCqzTKtzzKszzCszzGszvdFYikAAAAGdFJOUwBQYI+fucOe/hkAAAAJcEhZcwAAFxEAABcRAcom8z8AAADMSURBVDhPzZSNDoIwDITn397/kV27il9Rzmwq4Qux194VRmIombqqDzCvtV236LvRJos28rD6RlPGs5jpvHaZVTLWe0nEbCkxbnKkU4zcMw7xpvTqeHrho2WzzDfWHHPPmraCmAXWzRDrtZ7ZpCeNOe03c3xnL2bOdginc2Iz6/yYuDGxP+WG1Q8Qmvxxx6UGQUgNgpAaBCE1CEJqEITUIHhxXGquTjTHBa+mQRBSgyCkBkFIDYKQGgQhNQhCahDsMmGfoA1r351BSrkDTQQSzEhW2qYAAAAASUVORK5CYII=);}' +
        '.azmaps-map-fullscreen-collapse{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAD1BMVEWWnJ+Xmp+YnKKYnKKYnKHcteq5AAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAFxEAABcRAcom8z8AAAAHdElNRQfiCw8VGzLD58rvAAAANUlEQVQ4y2NgIB+wuLg4IKhRGUpkXGAAKgMFg0JmuIHBH9ajuYTaMszGxgZAiklJSYFg+gAAKrRnAIqOPxgAAAAASUVORK5CYII=);}' +
        '.azmaps-map-fullscreen-collapse:hover{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAD1BMVEUwrMwwqs0yrM8yrM8xrM6kUFC0AAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAFxEAABcRAcom8z8AAAAHdElNRQfiCw8VGSuVugCtAAAANUlEQVQ4y2NgIB+wuLg4IKhRGUpkXGAAKgMFg0JmuIHBH9ajuYTaMszGxgZAiklJSYFg+gAAKrRnAIqOPxgAAAAASUVORK5CYII=);}';

    /****************************
     * Constructor
     ***************************/

    /**
     * A control that toggles the map or a specific container from its defined size to a fullscreen size.
     * @param options Options for defining how the control is rendered and functions.
     */
    constructor(options?: FullscreenControlOptions) {
        super();

        this._options = Object.assign(this._options, options || {});
    }

    /****************************
     * Public Methods
     ***************************/

    /** Disposes the control. */
    public dispose(): void {
        const self = this;

        if (self._map) {
            self._map.controls.remove(self);
        }

        Object.keys(self).forEach(k => {
            self[k] = null;
        });
    }

    /** Gets the options of the control. */
    public getOptions(): FullscreenControlOptions {
        return Object.assign({}, this._options);
    }

    /**
     * Action to perform when the control is added to the map.
     * @param map The map the control was added to.
     * @param options The control options used when adding the control to the map.
     * @returns The HTML Element that represents the control.
     */
    public onAdd(map: azmaps.Map, options?: azmaps.ControlOptions): HTMLElement {
        const self = this;
        self._map = map;

        const isSupported = FullscreenControl.isSupported();

        if (isSupported || (!isSupported && !this._options.hideIfUnsupported)) {
            const mcl = map.getMapContainer().classList;
            if (mcl.contains("high-contrast-dark")) {
                self._hclStyle = <azmaps.ControlStyle>'dark';
            } else if (mcl.contains("high-contrast-light")) {
                self._hclStyle = <azmaps.ControlStyle>'light';
            }

            const resx = self._getTranslations(map.getStyle().language);
            self._resource = resx;

            if (!self._container) {
                self._container = this._map.getMapContainer();

                if (!self._container.classList.contains('azmaps-map-fullscreen-container')) {
                    self._container.classList.add('azmaps-map-fullscreen-container');
                }
            }

            //Add css for fullscreen. Add the CSS style for the control to the DOM.
            const style = document.createElement('style');
            style.innerHTML = FullscreenControl._fullscreenCss;
            document.body.appendChild(style);

            //Create the fullscreen button.
            const bc = document.createElement('div');
            bc.classList.add('azure-maps-control-container');
            bc.setAttribute('aria-label', resx[2]);
            bc.style.flexDirection = 'column';
            self._btnContainer = bc;

            const b = document.createElement("button");
            b.classList.add('azmaps-map-fullscreen-btn');
            b.classList.add('azmaps-map-fullscreen-expand');
            b.setAttribute('title', resx[1]);
            b.setAttribute('alt', resx[1]);
            b.setAttribute('type', 'button');
            b.addEventListener('click', self._toggleFullscreen);
            self._button = b;
            self._updateBtn();
            self._btnContainer.appendChild(self._button);

            let changeEventName: string;

            if (document['fullscreenchange']) {
                changeEventName = 'fullscreenchange';
            } else if (document['webkitCancelFullScreen']) {
                changeEventName = 'webkitfullscreenchange';
            } else if (document['mozCancelFullScreen']) {
                changeEventName = 'mozfullscreenchange';
            } else if (document['msExitFullscreen']) {
                changeEventName = 'MSFullscreenChange';
            }

            if (changeEventName) {
                document.addEventListener(changeEventName, () => { self._updateBtn() });
            }

            self.setOptions(self._options);

            return self._btnContainer;
        }

        return null;
    }

    /**
     * Action to perform when control is removed from the map.
     */
    public onRemove(): void {
        const self = this;
        const c = self._container;
        const bc = self._btnContainer;

        if (c && c.classList.contains('azmaps-map-fullscreen-container')) {
            c.classList.remove('azmaps-map-fullscreen-container');
        }

        if (bc) {
            bc.remove();
            self._btnContainer = null;
        }

        if (self._options.style === 'auto') {
            self._map.events.remove('styledata', self._mapStyleChanged);
        }

        self._map = null;
    }

    /**
     * Sets the options of the control. 
     * @param options The options.
     */
    public setOptions(options: FullscreenControlOptions): void {
        if (options) {
            const self = this;
            const map = self._map;
            const opt = self._options;

            if (options.container !== undefined) {
                var isFullscreen = self.isFullscreen();
                if (isFullscreen) {
                    self._toggleFullscreen();
                }

                var c = self._container;

                if (c && c.classList.contains('azmaps-map-fullscreen-container')) {
                    c.classList.remove('azmaps-map-fullscreen-container');
                }

                opt.container = options.container;
                c = null;

                if (options.container === null) {
                    c = map.getMapContainer();
                } else if (typeof options.container === 'string') {
                    c = document.getElementById(options.container);

                    if (!c) {
                        c = document.querySelector(options.container);
                    }
                } else if (options.container instanceof HTMLElement) {
                    c = options.container;
                }

                self._container = c;

                if (c && !c.classList.contains('azmaps-map-fullscreen-container')) {
                    c.classList.add('azmaps-map-fullscreen-container');

                    if (isFullscreen) {
                        self._toggleFullscreen();
                    }
                }
            }

            if (typeof options.hideIfUnsupported === 'boolean' && opt.hideIfUnsupported !== options.hideIfUnsupported) {
                opt.hideIfUnsupported = options.hideIfUnsupported;

                if (!FullscreenControl.isSupported() && map) {
                    self.onRemove();
                    self.onAdd(map);
                }
            }

            if (typeof options.style === 'string') {
                let color = 'white';

                if (self._hclStyle) {
                    if (self._hclStyle === 'dark') {
                        color = self._darkColor;
                    }
                } else {
                    if (opt.style === 'auto') {
                        map.events.remove('styledata', self._mapStyleChanged);
                    }

                    opt.style = options.style;

                    switch (options.style) {
                        case 'dark':
                            color = self._darkColor;
                            break;
                        case 'auto':
                            //Color will change between light and dark depending on map style.
                            map.events.add('styledata', self._mapStyleChanged);
                            color = self._getColorFromMapStyle();
                            break;
                        case 'light':
                            break;
                    }
                }

                self._button.style.backgroundColor = color;
            }
        }
    }

    /**
     * Checks if the map or specified container is in fullscreen mode or not. 
     */
    public isFullscreen(): boolean {
        const d = document;
        return !(!d['fullscreenElement'] &&
            !d['msFullscreenElement'] &&
            !d['mozFullScreenElement'] &&
            !d['webkitFullscreenElement']);
    }

    /**
     * Checks to see if the browser supports going into fullscreen mode.
     */
    public static isSupported(): boolean {
        const d = document;
        return d['fullscreenEnabled'] ||
            d['msFullscreenEnabled'] ||
            d['mozFullScreenEnabled'] ||
            d['webkitFullscreenEnabled'];
    }

    /****************************
     * Private Methods
     ***************************/

    private _toggleFullscreen = () => {
        const self = this;

        if (self._container) {
            if (self.isFullscreen()) {
                const d = document;
                const closeFullscreenFn =
                    d['webkitCancelFullScreen']
                    || d['cancelFullScreen']
                    || d['mozCancelFullScreen']
                    || d['msExitFullscreen']
                    || d.exitFullscreen;

                closeFullscreenFn.call(document);
            } else {
                let c = self._container;
                const openFullscreenFn =
                    c['webkitRequestFullScreen']
                    || c['requestFullScreen']
                    || c['mozRequestFullScreen']
                    || c['msRequestFullscreen']
                    || c.requestFullscreen;

                openFullscreenFn.call(c);
            }
        }
    }

    /**
     * An event handler for when the map style changes. Used when control style is set to auto.
     */
    private _mapStyleChanged = () => {
        const self = this;
        if (self._button && !self._hclStyle) {
            self._button.style.backgroundColor = self._getColorFromMapStyle();
        }
    }

    /**
     * Retrieves the background color for the button based on the map style. This is used when style is set to auto.
     */
    private _getColorFromMapStyle(): string {
        //When the style is dark (i.e. satellite, night), show the dark colored theme.
        if (['satellite', 'satellite_road_labels', 'grayscale_dark', 'night'].indexOf(this._map.getStyle().style) > -1) {
            return this._darkColor;
        }

        return 'white';
    }

    /**
     * Toggles the fullscreen state of the button.
     */
    private _updateBtn(): void {
        const self = this;
        const resx = self._resource;

        let ariaLabel = resx[1];
        let removeClass: string;
        let addClass: string;

        if (self.isFullscreen()) {
            //Is fullscreen, exit.
            ariaLabel = resx[0];

            removeClass = 'expand';
            addClass = 'collapse';

            self._invokeEvent('fullscreenchanged', true);
        } else {
            //Make map full screen.
            ariaLabel = resx[1];

            removeClass = 'collapse';
            addClass = 'expand';

            self._invokeEvent('fullscreenchanged', false);
        }

        const btn = self._button;

        btn.setAttribute('title', ariaLabel);
        btn.setAttribute('alt', ariaLabel);

        btn.classList.remove('azmaps-map-fullscreen-' + removeClass);
        btn.classList.add('azmaps-map-fullscreen-' + addClass);
    }

    /**
     * Returns the set of translation text resources needed for the fullscreen control for a given language. 
     * Array values: 0 - View Fullscreen, 1 - Exit Fullscreen, 2 - Full Screen Control
     * @param lang The language code to retrieve the text resources for.
     * @returns An object containing text resources in the specified language.
     */
    private _getTranslations(lang?: string): string[] {
        if (lang && lang.indexOf('-') > 0) {
            lang = lang.substring(0, lang.indexOf('-'));
        }

        const t = FullscreenControl._translations;
        let r = t[lang];

        if (!r) {
            r = t['en']
        }

        return r;
    }

    private static _translations = {
        //Afrikaans
        'af': ['Verlaat volskerm', 'Vertoon volskerm', 'Volskerm beheer'],
        //Arabic
        'ar': ['الخروج من وضع ملئ للشاشة', 'المشاهدة بحجم الشاشة', 'تحكم ملء الشاشة'],
        //Basque
        'eu': ['Irten pantaila osoko', 'ikusi pantaila osoan', 'Pantaila osoa kontrol'],
        //Bulgarian
        'bg': ['Изход на цял екран', 'Преглед на цял екран', 'Контрол на цял екран'],
        //Chinese
        'zh': ['退出全屏', '全屏查看', '全屏控制'],
        //Croatian
        'hr': ['Izlaz na cijelom zaslonu', 'Prikaz na cijelom zaslonu', 'Puni zaslon kontrola'],
        //Czech
        'cs': ['Ukončit celou obrazovku', 'pohled na celou obrazovku', 'fullscreen kontrola'],
        //Danish
        'da': ['Afslut fuld skærm', 'Se fuld skærm', 'fullscreen kontrol'],
        //Dutch
        'nl': ['Verlaat volledig scherm', 'Bekijk fullscreen', 'fullscreen controle'],
        //Estonian
        'et': ['Välja täisekraani', 'Vaata täisekraani', 'Täisekraan kontrolli'],
        //Finnish
        'fi': ['Poistu koko näytöstä', 'Koko näyttö', 'fullscreen ohjaus'],
        //French
        'fr': ['Quitter le mode plein écran', 'Voir en plein écran', 'Contrôle plein écran'],
        //Galician
        'gl': ['Saia da pantalla completa', 'Ver a pantalla completa', 'Control de pantalla completa'],
        //German
        'de': ['Beenden Vollbild', 'Ansicht Vollbild', 'Vollbild-Steuerung'],
        //Greek
        'el': ['Έξοδος από πλήρη οθόνη', 'Προβολή σε πλήρη οθόνη', 'Πλήρης οθόνη ελέγχου'],
        //Hindi
        'hi': ['पूर्ण स्क्रीन से बाहर निकलें', 'पूर्णस्क्रीन देखें', 'पूर्ण स्क्रीन नियंत्रण'],
        //Hungarian
        'hu': ['Kilépés a teljes képernyős', 'Megtekintés teljes képernyőn', 'Nagyítás ellenőrzés'],
        //Indonesian
        'id': ['Keluar layar penuh', 'Lihat fullscreen', 'Kontrol layar penuh'],
        //Italian
        'it': ['Esci da schermo intero', 'Visualizza schermo intero', 'controllo a tutto schermo'],
        //Japanese
        'ja': ['出口フルスクリーン', '表示フルスクリーン', 'フルスクリーンコントロール'],
        //Kazakh
        'kk': ['Толық экраннан шығу', 'View толық экран', 'Fullscreen бақылау'],
        //Korean
        'ko': ['전체 화면 종료', '전체 화면보기', '전체 화면 제어'],
        //Spanish
        'es': ['Salir de pantalla completa', 'Ver en pantalla completa', 'control de pantalla completa'],
        //Latvian
        'lv': ['Iziet no pilnekrāna', 'Skatīt pilnekrāna režīmā', 'Pilnekrāna kontrole'],
        //Lithuanian
        'lt': ['Išjungti viso ekrano režimą', 'Peržiūrėti per visą ekraną', 'Fullscreen kontrolė'],
        //Malay
        'ms': ['keluar skrin penuh', 'paparan skrin penuh', 'kawalan skrin penuh'],
        //Norwegian
        'nb': ['Avslutt full skjerm', 'Vis fullskjerm', 'Full skjermkontroll'],
        //Polish
        'pl': ['Wyłączyć tryb pełnoekranowy', 'Zobacz na pełnym ekranie', 'kontrola na pełnym ekranie'],
        //Portuguese
        'pt': ['Sair em tela cheia', 'Ver tela cheia', 'controle de tela cheia'],
        //Romanian
        'ro': ['Ieșire ecran complet', 'Vezi tot ecranul', 'controlul pe tot ecranul'],
        //Russian
        'ru': ['Выход из полноэкранного режима', 'Просмотреть весь экран', 'Полноэкранный контроль'],
        //Serbian
        'sr': ['Излаз из целог екрана', 'Погледај преко целог екрана', 'фуллсцреен контрола'],
        //Slovak
        'sk': ['Skončiť celú obrazovku', 'pohľad na celú obrazovku', 'fullscreen kontrola'],
        //Slovenian
        'sl': ['Izhod celozaslonski', 'Poglej celozaslonski', 'celozaslonski nadzor'],
        //Swedish
        'sv': ['Avsluta helskärm', 'Visa helskärm', 'Full skärms kontroll'],
        //Thai
        'th': ['แบบเต็มหน้าจอออกจาก', 'ดูแบบเต็มจอ', 'การควบคุมแบบเต็มหน้าจอ'],
        //Turkish
        'tr': ['Tam ekrandan çık', 'Tam ekran görüntüle', 'Tam Ekran kontrolü'],
        //Ukrainian
        'uk': ['Вихід з повноекранного режиму', 'Переглянути весь екран', 'Редакція контроль'],
        //Vietnamese
        'vi': ['Thoát toàn màn hình', 'Xem toàn màn hình', 'kiểm soát toàn màn hình'],
        //English
        'en': ['Exit Fullscreen', 'View Fullscreen', 'Fullscreen Control']
    };
}