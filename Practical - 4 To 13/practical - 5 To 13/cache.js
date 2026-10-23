import NodeCache from "node-cache";

// Initialize in-memory cache with standard TTL of 60 seconds
const cache = new NodeCache({ stdTTL: 60, checkperiod: 60 });

export default cache;
export { cache };
