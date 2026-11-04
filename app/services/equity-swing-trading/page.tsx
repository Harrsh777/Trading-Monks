import { serviceRoute } from "../service-route";

const route = serviceRoute("swingTrading");

export const generateMetadata = route.generateMetadata;
export default route.Page;
