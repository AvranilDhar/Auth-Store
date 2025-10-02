import { ENV } from '../env.js';
import { Resend } from 'resend';

export const resend = new Resend(`${ENV.RESEND_KEY}`);




