import { serviceRoute } from "../service-route";

const route = serviceRoute("optionBuying");

export const generateMetadata = route.generateMetadata;
export default route.Page;
