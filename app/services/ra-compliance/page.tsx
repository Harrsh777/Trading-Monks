import { serviceRoute } from "../service-route";

const route = serviceRoute("raCompliance");

export const generateMetadata = route.generateMetadata;
export default route.Page;
