import { Listener } from "@/types";

// Ajustez ici la signature de retour pour indiquer que `subscribe` retourne une fonction de type `() => void`.
export function createStore<T extends object>(initialState: T): [T, (listener: Listener<T>) => () => void] {
    let listeners: Listener<T>[] = [];

    const handler: ProxyHandler<T> = {
        set(target, property, value) {
            const result = Reflect.set(target, property, value);
            listeners.forEach(listener => listener(state));
            return result;
        }
    };

    const state = new Proxy(initialState, handler);

    function subscribe(listener: Listener<T>): () => void {
        listeners.push(listener);
        // Retournez correctement une fonction de désabonnement ici
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }

    return [state, subscribe];
}