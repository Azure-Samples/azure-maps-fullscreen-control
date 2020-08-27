import * as azmaps from "azure-maps-control";
import { FullscreenTranslation } from './FullscreenTranslation';
import { FullscreenControlOptions } from './FullscreenControlOptions';
import { Utils } from '../helpers/Utils';

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
    private _hclStyle:azmaps.ControlStyle;
    private _darkColor = '#011c2c';
    private _map: azmaps.Map;
    private _resource: FullscreenTranslation;
    private _container: HTMLElement;

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
        if(this._map){
            this._map.controls.remove(this);
        }

        Object.keys(this).forEach(k => {
            this[k] = null;
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
        this._map = map;

        var isSupported = FullscreenControl.isSupported();

        if (isSupported || (!isSupported && !this._options.hideIfUnsupported)) {
            this._hclStyle = Utils.getHclStyle(map);

            this._resource = FullscreenControl._getTranslations(this._map.getStyle().language);

            if(!this._container){
                this._container = this._map.getMapContainer();

                if(!this._container.classList.contains('azmaps-map-fullscreen-container')){
                    this._container.classList.add('azmaps-map-fullscreen-container');
                }
            }

            //Add css for fullscreen. Add the CSS style for the control to the DOM.
            var style = document.createElement('style');
            style.innerHTML = FullscreenControl._fullscreenCss;
            document.body.appendChild(style);

            //Create the fullscreen button.
            this._btnContainer = document.createElement('div');
            this._btnContainer.classList.add('azure-maps-control-container');
            this._btnContainer.setAttribute('aria-label', this._resource.title);
            this._btnContainer.style.flexDirection = 'column';

            this._button = document.createElement("button");
            this._button.classList.add('azmaps-map-fullscreen-btn');
            this._button.classList.add('azmaps-map-fullscreen-expand');
            this._button.setAttribute('title', this._resource.view);
            this._button.setAttribute('alt', this._resource.view);
            this._button.setAttribute('type', 'button');
            this._button.addEventListener('click', this._toggleFullscreen);
            this._updateBtn();
            this._btnContainer.appendChild(this._button);

            var changeEventName: string;

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
                document.addEventListener(changeEventName, () => { this._updateBtn() });
            }

            this.setOptions(this._options);

            return this._btnContainer;
        }

        return null;
    }

    /**
     * Action to perform when control is removed from the map.
     */
    public onRemove(): void {
        if(this._container && this._container.classList.contains('azmaps-map-fullscreen-container')){
            this._container.classList.remove('azmaps-map-fullscreen-container');
        }

        if (this._btnContainer) {
            this._btnContainer.remove();
            this._btnContainer = null;
        }

        if (this._options.style === 'auto') {
            this._map.events.remove('styledata', () => { this._mapStyleChanged(); });
        }

        this._map = null;
    }

    /**
     * Sets the options of the control. 
     * @param options The options.
     */
    public setOptions(options: FullscreenControlOptions): void {
        if(options){
            if(options.container !== undefined){
                var isFullscreen = this.isFullscreen();
                if(isFullscreen){
                    this._toggleFullscreen();
                }

                if(this._container && this._container.classList.contains('azmaps-map-fullscreen-container')){
                    this._container.classList.remove('azmaps-map-fullscreen-container');
                }

                this._options.container = options.container;
                this._container = null;

                if(options.container === null){
                    this._container = this._map.getMapContainer();
                } else if(typeof options.container === 'string') {
                    this._container = document.getElementById(options.container);

                    if(!this._container){
                        this._container = document.querySelector(options.container);
                    }
                } else if(options.container instanceof HTMLElement) {
                    this._container = options.container;
                }

                if(this._container && !this._container.classList.contains('azmaps-map-fullscreen-container')){
                    this._container.classList.add('azmaps-map-fullscreen-container');

                    if(isFullscreen){
                        this._toggleFullscreen();
                    }
                }
            }

            if(typeof options.hideIfUnsupported === 'boolean' && this._options.hideIfUnsupported !== options.hideIfUnsupported){
                this._options.hideIfUnsupported = options.hideIfUnsupported;

                if(!FullscreenControl.isSupported() && this._map){
                    this.onRemove();
                    this.onAdd(this._map);
                 }
            }

            if(typeof options.style === 'string'){
                var color = 'white';

                if(this._hclStyle) {
                    if(this._hclStyle === 'dark'){
                        color = this._darkColor;
                    }
                } else {
                    if (this._options.style === 'auto') {
                        this._map.events.remove('styledata', this._mapStyleChanged);
                    }

                    this._options.style = options.style;

                    switch (options.style) {
                        case 'dark':
                            color = this._darkColor;
                            break;
                        case 'auto':
                            //Color will change between light and dark depending on map style.
                            this._map.events.add('styledata', this._mapStyleChanged);
                            color = this._getColorFromMapStyle();
                            break;
                        case 'light':
                            break;
                    }
                }

                this._button.style.backgroundColor = color;  
            }
        }
    }

    /**
     * Checks if the map or specified container is in fullscreen mode or not. 
     */
    public isFullscreen(): boolean {
        return !(!document['fullscreenElement'] &&
            !document['msFullscreenElement'] &&
            !document['mozFullScreenElement'] &&
            !document['webkitFullscreenElement']);
    }

    /**
     * Checks to see if the browser supports going into fullscreen mode.
     */
    public static isSupported(): boolean {
        return document['fullscreenEnabled'] ||
            document['msFullscreenEnabled'] ||
            document['mozFullScreenEnabled'] ||
            document['webkitFullscreenEnabled'];
    }

    /****************************
     * Private Methods
     ***************************/

     private _toggleFullscreen = () => {
         if(this._container){
            if (this.isFullscreen()) {
                var closeFullScreenFn =
                    document['webkitCancelFullScreen']
                    || document['cancelFullScreen']
                    || document['mozCancelFullScreen']
                    || document['msExitFullscreen']
                    || document.exitFullscreen;

                closeFullScreenFn.call(document);
            } else {
                var openFullScreenFn =
                    this._container['webkitRequestFullScreen']
                    || this._container['requestFullScreen']
                    || this._container['mozRequestFullScreen']
                    || this._container['msRequestFullscreen']
                    || this._container.requestFullscreen;

                openFullScreenFn.call(this._container);
            }
        }
     }

    /**
     * An event handler for when the map style changes. Used when control style is set to auto.
     */
    private _mapStyleChanged(): void {
        if (this._button) {
            this._button.style.backgroundColor = this._getColorFromMapStyle();
        }
    }

    /**
     * Retrieves the background color for the button based on the map style. This is used when style is set to auto.
     */
    private _getColorFromMapStyle(): string {
        var style = this._map.getStyle().style;
        var color = 'white';

        switch (style) {
            //When the style is dark (i.e. satellite, night), show the dark colored theme.
            case 'satellite':
            case 'satellite_road_labels':
            case 'grayscale_dark':
            case 'night':
                color = this._darkColor;
                break;
            //When the style is bright (i.e. road), show the light colored theme.
            case 'road':
            case 'grayscale_light':
            default:
                break;
        }

        return color;
    }

    /**
     * Toggles the fullscreen state of the button.
     */
    private _updateBtn(): void {
        var ariaLabel = this._resource.view;
        var removeClass, addClass;

        if (this.isFullscreen()) {
            //Is fullscreen, exit.
            ariaLabel = this._resource.exit;

            removeClass = 'azmaps-map-fullscreen-expand';
            addClass = 'azmaps-map-fullscreen-collapse';

            this._invokeEvent('fullscreenchanged', false);
        } else {
            //Make map full screen.
            ariaLabel = this._resource.view;

            removeClass = 'azmaps-map-fullscreen-collapse';
            addClass = 'azmaps-map-fullscreen-expand';

            this._invokeEvent('fullscreenchanged', true);
        }

        this._button.setAttribute('title', ariaLabel);
        this._button.setAttribute('alt', ariaLabel);

        this._button.classList.remove(removeClass);
        this._button.classList.add(addClass);
    }

    /**
     * Returns the set of translation text resources needed for the fullscreen control for a given language.
     * @param lang The language code to retrieve the text resources for.
     * @returns An object containing text resources in the specified language.
     */
    private static _getTranslations(lang?: string): FullscreenTranslation {
        if (lang && lang.indexOf('-') > 0) {
            lang = lang.substring(0, lang.indexOf('-'));
        }

        switch (lang.toLowerCase()) {
            //Afrikaans
            case 'af':
                return { exit: 'Verlaat volskerm', view: 'Vertoon volskerm', title: 'Volskerm beheer' };
            //Arabic
            case 'ar':
                return { exit: 'الخروج من وضع ملئ للشاشة', view: 'المشاهدة بحجم الشاشة', title: 'تحكم ملء الشاشة' };
            //Basque
            case 'eu':
                return { exit: 'Irten pantaila osoko', view: 'ikusi pantaila osoan', title: 'Pantaila osoa kontrol' };
            //Bulgarian
            case 'bg':
                return { exit: 'Изход на цял екран', view: 'Преглед на цял екран', title: 'Контрол на цял екран' };
            //Chinese
            case 'zh':
                return { exit: '退出全屏', view: '全屏查看', title: '全屏控制' };
            //Croatian
            case 'hr':
                return { exit: 'Izlaz na cijelom zaslonu', view: 'Prikaz na cijelom zaslonu', title: 'Puni zaslon kontrola' };
            //Czech
            case 'cs':
                return { exit: 'Ukončit celou obrazovku', view: 'pohled na celou obrazovku', title: 'fullscreen kontrola' };
            //Danish
            case 'da':
                return { exit: 'Afslut fuld skærm', view: 'Se fuld skærm', title: 'fullscreen kontrol' };
            //Dutch
            case 'nl':
                return { exit: 'Verlaat volledig scherm', view: 'Bekijk fullscreen', title: 'fullscreen controle' };
            //Estonian
            case 'et':
                return { exit: 'Välja täisekraani', view: 'Vaata täisekraani', title: 'Täisekraan kontrolli' };
            //Finnish
            case 'fi':
                return { exit: 'Poistu koko näytöstä', view: 'Koko näyttö', title: 'fullscreen ohjaus' };
            //French
            case 'fr':
                return { exit: 'Quitter le mode plein écran', view: 'Voir en plein écran', title: 'Contrôle plein écran' };
            //Galician
            case 'gl':
                return { exit: 'Saia da pantalla completa', view: 'Ver a pantalla completa', title: 'Control de pantalla completa' };
            //German
            case 'de':
                return { exit: 'Beenden Vollbild', view: 'Ansicht Vollbild', title: 'Vollbild-Steuerung' };
            //Greek
            case 'el':
                return { exit: 'Έξοδος από πλήρη οθόνη', view: 'Προβολή σε πλήρη οθόνη', title: 'Πλήρης οθόνη ελέγχου' };
            //Hindi
            case 'hi':
                return { exit: 'पूर्ण स्क्रीन से बाहर निकलें', view: 'पूर्णस्क्रीन देखें', title: 'पूर्ण स्क्रीन नियंत्रण' };
            //Hungarian
            case 'hu':
                return { exit: 'Kilépés a teljes képernyős', view: 'Megtekintés teljes képernyőn', title: 'Nagyítás ellenőrzés' };
            //Indonesian
            case 'id':
                return { exit: 'Keluar layar penuh', view: 'Lihat fullscreen', title: 'Kontrol layar penuh' };
            //Italian
            case 'it':
                return { exit: 'Esci da schermo intero', view: 'Visualizza schermo intero', title: 'controllo a tutto schermo' };
            //Japanese
            case 'ja':
                return { exit: '出口フルスクリーン', view: '表示フルスクリーン', title: 'フルスクリーンコントロール' };
            //Kazakh
            case 'kk':
                return { exit: 'Толық экраннан шығу', view: 'View толық экран', title: 'Fullscreen бақылау' };
            //Korean
            case 'ko':
                return { exit: '전체 화면 종료', view: '전체 화면보기', title: '전체 화면 제어' };
            //Spanish
            case 'es':
                return { exit: 'Salir de pantalla completa', view: 'Ver en pantalla completa', title: 'control de pantalla completa' };
            //Latvian
            case 'lv':
                return { exit: 'Iziet no pilnekrāna', view: 'Skatīt pilnekrāna režīmā', title: 'Pilnekrāna kontrole' };
            //Lithuanian
            case 'lt':
                return { exit: 'Išjungti viso ekrano režimą', view: 'Peržiūrėti per visą ekraną', title: 'Fullscreen kontrolė' };
            //Malay
            case 'ms':
                return { exit: 'keluar skrin penuh', view: 'paparan skrin penuh', title: 'kawalan skrin penuh' };
            //Norwegian
            case 'nb':
                return { exit: 'Avslutt full skjerm', view: 'Vis fullskjerm', title: 'Full skjermkontroll' };
            //Polish
            case 'pl':
                return { exit: 'Wyłączyć tryb pełnoekranowy', view: 'Zobacz na pełnym ekranie', title: 'kontrola na pełnym ekranie' };
            //Portuguese
            case 'pt':
                return { exit: 'Sair em tela cheia', view: 'Ver tela cheia', title: 'controle de tela cheia' };
            //Romanian
            case 'ro':
                return { exit: 'Ieșire ecran complet', view: 'Vezi tot ecranul', title: 'controlul pe tot ecranul' };
            //Russian
            case 'ru':
                return { exit: 'Выход из полноэкранного режима', view: 'Просмотреть весь экран', title: 'Полноэкранный контроль' };
            //Serbian
            case 'sr':
                return { exit: 'Излаз из целог екрана', view: 'Погледај преко целог екрана', title: 'фуллсцреен контрола' };
            //Slovak
            case 'sk':
                return { exit: 'Skončiť celú obrazovku', view: 'pohľad na celú obrazovku', title: 'fullscreen kontrola' };
            //Slovenian
            case 'sl':
                return { exit: 'Izhod celozaslonski', view: 'Poglej celozaslonski', title: 'celozaslonski nadzor' };
            //Swedish
            case 'sv':
                return { exit: 'Avsluta helskärm', view: 'Visa helskärm', title: 'Full skärms kontroll' };
            //Thai
            case 'th':
                return { exit: 'แบบเต็มหน้าจอออกจาก', view: 'ดูแบบเต็มจอ', title: 'การควบคุมแบบเต็มหน้าจอ' };
            //Turkish
            case 'tr':
                return { exit: 'Tam ekrandan çık', view: 'Tam ekran görüntüle', title: 'Tam Ekran kontrolü' };
            //Ukrainian
            case 'uk':
                return { exit: 'Вихід з повноекранного режиму', view: 'Переглянути весь екран', title: 'Редакція контроль' };
            //Vietnamese
            case 'vi':
                return { exit: 'Thoát toàn màn hình', view: 'Xem toàn màn hình', title: 'kiểm soát toàn màn hình' };
            //English
            case 'en':
            default:
                return { exit: 'Exit Fullscreen', view: 'View Fullscreen', title: 'Fullscreen Control' };
        }
    }
}