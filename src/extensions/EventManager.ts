import { FullscreenControl, FullscreenControlEvents } from '../control';

/**
 * This module partially defines the map control.
 * This definition only includes the features added by using the drawing tools.
 * For the base definition see:
 * https://docs.microsoft.com/javascript/api/azure-maps-control/?view=azure-maps-typescript-latest
 */
declare module "azure-maps-control" {
    /**
     * This interface partially defines the map control's `EventManager`.
     * This definition only includes the method added by using the drawing tools.
     * For the base definition see:
     * https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.eventmanager?view=azure-maps-typescript-latest
     */
    export interface EventManager {
        /**
         * Adds an event to the `fullscreenchanged`.
         * @param eventType The event name.
         * @param target The `fullscreenchanged` to add the event for.
         * @param callback The event handler callback.
         */
        add(eventType: "fullscreenchanged", target: FullscreenControl, callback: (e: FullscreenControlEvents) => void): void;

        /**
         * Adds an event to the `fullscreenchanged` once.
         * @param eventType The event name.
         * @param target The `fullscreenchanged` to add the event for.
         * @param callback The event handler callback.
         */
        addOnce(eventType: "fullscreenchanged", target: FullscreenControl, callback: (e: FullscreenControlEvents) => void): void;

 
        /**
         * Removes an event listener from the `fullscreenchanged`.
         * @param eventType The event name.
         * @param target The `fullscreenchanged` to remove the event for.
         * @param callback The event handler callback.
         */
        remove(eventType: string, target: FullscreenControl, callback: (e?: any) => void): void;
    }
}
