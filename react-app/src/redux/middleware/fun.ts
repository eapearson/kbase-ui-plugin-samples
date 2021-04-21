import {StoreState} from "../store";
import accessFun from "./access";
import linkedDataFun from "./linkedData";
import sampleFun from "./sample";
import {AsyncProxyFactory} from "@kbase/ui-components/lib/redux/middleware/AsyncProxy"

export function makeActionProxy() {
    const asyncProxyFactory = new AsyncProxyFactory<StoreState>();

    // asyncProxyFactory.add(async ({ action, next }) => {
    //   console.log("Action:", action);
    //   next(action);
    //   return false;
    // });

    asyncProxyFactory.add(sampleFun);
    asyncProxyFactory.add(linkedDataFun);
    asyncProxyFactory.add(accessFun);
    return asyncProxyFactory.createMiddleware();
}