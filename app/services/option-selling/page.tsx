import { serviceRoute } from "../service-route";

const route = serviceRoute("optionSelling");

export const generateMetadata = route.generateMetadata;
export default route.Page;
