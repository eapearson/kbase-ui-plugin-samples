import {Middleware} from "redux";
import {StoreState} from "redux/store";

export const logger: Middleware<{}, // Most middleware do not modify the dispatch return value
    StoreState> = (storeApi) =>
    (next) =>
        (action) => {
            console.log("action log:", action);
            return next(action);
        };
