import { createHash } from 'crypto'; export const sha256=(t:string)=>createHash('sha256').update(t).digest('hex');
