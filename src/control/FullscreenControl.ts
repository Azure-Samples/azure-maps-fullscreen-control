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
    private _hclStyle:azmaps.ControlStyle;
    private _darkColor = '#011c2c';
    private _map: azmaps.Map;

    /**
     * Resource values: 0 - View Fullscreen, 1 - Exit Fullscreen, 2 - Full Screen Control
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
            let mcl = map.getMapContainer().classList;
            if(mcl.contains("high-contrast-dark")){
                this._hclStyle = <azmaps.ControlStyle>'dark';
            }  else if (mcl.contains("high-contrast-light")){
                this._hclStyle = <azmaps.ControlStyle>'light';
            }

            this._resource = this._getTranslations(this._map.getStyle().language);

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
            let bc = document.createElement('div');
            bc.classList.add('azure-maps-control-container');
            bc.setAttribute('aria-label', this._resource[2]);
            bc.style.flexDirection = 'column';
            this._btnContainer = bc;

            let b = document.createElement("button");
            b.classList.add('azmaps-map-fullscreen-btn');
            b.classList.add('azmaps-map-fullscreen-expand');
            b.setAttribute('title', this._resource[0]);
            b.setAttribute('alt', this._resource[0]);
            b.setAttribute('type', 'button');
            b.addEventListener('click', this._toggleFullscreen);
            this._button = b;
            this._updateBtn();
            this._btnContainer.appendChild(this._button);       

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

                var c = this._container;

                if(c && c.classList.contains('azmaps-map-fullscreen-container')){
                    c.classList.remove('azmaps-map-fullscreen-container');
                }

                this._options.container = options.container;
                c = null;

                if(options.container === null){
                    c = this._map.getMapContainer();
                } else if(typeof options.container === 'string') {
                    c = document.getElementById(options.container);

                    if(!c){
                        c = document.querySelector(options.container);
                    }
                } else if(options.container instanceof HTMLElement) {
                    c = options.container;
                }

                this._container = c;

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
                let color = 'white';

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
                let closeFullscreenFn =
                    document['webkitCancelFullScreen']
                    || document['cancelFullScreen']
                    || document['mozCancelFullScreen']
                    || document['msExitFullscreen']
                    || document.exitFullscreen;

                    closeFullscreenFn.call(document);
            } else {
                let c = this._container;
                var openFullscreenFn =
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
    private _mapStyleChanged(): void {
        if (this._button && !this._hclStyle) {
            this._button.style.backgroundColor = this._getColorFromMapStyle();
        }
    }

    /**
     * Retrieves the background color for the button based on the map style. This is used when style is set to auto.
     */
    private _getColorFromMapStyle(): string {
        //When the style is dark (i.e. satellite, night), show the dark colored theme.
        if(['satellite', 'satellite_road_labels', 'grayscale_dark','night'].indexOf(this._map.getStyle().style) > -1){
            return this._darkColor;
        }

        return 'white';
    }

    /**
     * Toggles the fullscreen state of the button.
     */
    private _updateBtn(): void {
        var ariaLabel = this._resource[0];
        var removeClass, addClass;

        if (this.isFullscreen()) {
            //Is fullscreen, exit.
            ariaLabel = this._resource[1];

            removeClass = 'expand';
            addClass = 'collapse';

            this._invokeEvent('fullscreenchanged', false);
        } else {
            //Make map full screen.
            ariaLabel = this._resource[0];

            removeClass = 'collapse';
            addClass = 'expand';

            this._invokeEvent('fullscreenchanged', true);
        }

        this._button.setAttribute('title', ariaLabel);
        this._button.setAttribute('alt', ariaLabel);

        this._button.classList.remove('azmaps-map-fullscreen-' + removeClass);
        this._button.classList.add('azmaps-map-fullscreen-' + addClass);
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

        var t = FullscreenControl._translations;
        var r = t[lang];

        if(!r){
            r = t['en']
        }

        return r;
    }

    private static _translations = {
        //Afrikaans
        'af':['Verlaat volskerm', 'Vertoon volskerm', 'Volskerm beheer'],
        //Arabic
        'ar':['الخروج من وضع ملئ للشاشة', 'المشاهدة بحجم الشاشة', 'تحكم ملء الشاشة'],
        //Basque
        'eu':['Irten pantaila osoko', 'ikusi pantaila osoan', 'Pantaila osoa kontrol'],
        //Bulgarian
        'bg':['Изход на цял екран', 'Преглед на цял екран', 'Контрол на цял екран'],
        //Chinese
        'zh':['退出全屏', '全屏查看', '全屏控制'],
        //Croatian
        'hr':['Izlaz na cijelom zaslonu', 'Prikaz na cijelom zaslonu', 'Puni zaslon kontrola'],
        //Czech
        'cs':['Ukončit celou obrazovku', 'pohled na celou obrazovku', 'fullscreen kontrola'],
        //Danish
        'da':['Afslut fuld skærm', 'Se fuld skærm', 'fullscreen kontrol'],
        //Dutch
        'nl':['Verlaat volledig scherm', 'Bekijk fullscreen', 'fullscreen controle'],
        //Estonian
        'et':['Välja täisekraani', 'Vaata täisekraani', 'Täisekraan kontrolli'],
        //Finnish
        'fi':['Poistu koko näytöstä', 'Koko näyttö', 'fullscreen ohjaus'],
        //French
        'fr':['Quitter le mode plein écran', 'Voir en plein écran', 'Contrôle plein écran'],
        //Galician
        'gl':['Saia da pantalla completa', 'Ver a pantalla completa', 'Control de pantalla completa'],
        //German
        'de':['Beenden Vollbild', 'Ansicht Vollbild', 'Vollbild-Steuerung'],
        //Greek
        'el':['Έξοδος από πλήρη οθόνη', 'Προβολή σε πλήρη οθόνη', 'Πλήρης οθόνη ελέγχου'],
        //Hindi
        'hi':['पूर्ण स्क्रीन से बाहर निकलें', 'पूर्णस्क्रीन देखें', 'पूर्ण स्क्रीन नियंत्रण'],
        //Hungarian
        'hu':['Kilépés a teljes képernyős', 'Megtekintés teljes képernyőn', 'Nagyítás ellenőrzés'],
        //Indonesian
        'id':['Keluar layar penuh', 'Lihat fullscreen', 'Kontrol layar penuh'],
        //Italian
        'it':['Esci da schermo intero', 'Visualizza schermo intero', 'controllo a tutto schermo'],
        //Japanese
        'ja':['出口フルスクリーン', '表示フルスクリーン', 'フルスクリーンコントロール'],
        //Kazakh
        'kk':['Толық экраннан шығу', 'View толық экран', 'Fullscreen бақылау'],
        //Korean
        'ko':['전체 화면 종료', '전체 화면보기', '전체 화면 제어'],
        //Spanish
        'es':['Salir de pantalla completa', 'Ver en pantalla completa', 'control de pantalla completa'],
        //Latvian
        'lv':['Iziet no pilnekrāna', 'Skatīt pilnekrāna režīmā', 'Pilnekrāna kontrole'],
        //Lithuanian
        'lt':['Išjungti viso ekrano režimą', 'Peržiūrėti per visą ekraną', 'Fullscreen kontrolė'],
        //Malay
        'ms':['keluar skrin penuh', 'paparan skrin penuh', 'kawalan skrin penuh'],
        //Norwegian
        'nb':['Avslutt full skjerm', 'Vis fullskjerm', 'Full skjermkontroll'],
        //Polish
        'pl':['Wyłączyć tryb pełnoekranowy', 'Zobacz na pełnym ekranie', 'kontrola na pełnym ekranie'],
        //Portuguese
        'pt':['Sair em tela cheia', 'Ver tela cheia', 'controle de tela cheia'],
        //Romanian
        'ro':['Ieșire ecran complet', 'Vezi tot ecranul', 'controlul pe tot ecranul'],
        //Russian
        'ru':['Выход из полноэкранного режима', 'Просмотреть весь экран', 'Полноэкранный контроль'],
        //Serbian
        'sr':['Излаз из целог екрана', 'Погледај преко целог екрана', 'фуллсцреен контрола'],
        //Slovak
        'sk':['Skončiť celú obrazovku', 'pohľad na celú obrazovku', 'fullscreen kontrola'],
        //Slovenian
        'sl':['Izhod celozaslonski', 'Poglej celozaslonski', 'celozaslonski nadzor'],
        //Swedish
        'sv':['Avsluta helskärm', 'Visa helskärm', 'Full skärms kontroll'],
        //Thai
        'th':['แบบเต็มหน้าจอออกจาก', 'ดูแบบเต็มจอ', 'การควบคุมแบบเต็มหน้าจอ'],
        //Turkish
        'tr':['Tam ekrandan çık', 'Tam ekran görüntüle', 'Tam Ekran kontrolü'],
        //Ukrainian
        'uk':['Вихід з повноекранного режиму', 'Переглянути весь екран', 'Редакція контроль'],
        //Vietnamese
        'vi':['Thoát toàn màn hình', 'Xem toàn màn hình', 'kiểm soát toàn màn hình'],
        //English
        'en':['Exit Fullscreen', 'View Fullscreen', 'Fullscreen Control']
    };
}