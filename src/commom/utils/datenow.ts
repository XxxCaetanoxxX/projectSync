import { DateTime } from 'luxon';

export function datenow() {
    return DateTime.now().setZone('America/Sao_Paulo').minus({ hours: 3 }).toUTC().toJSDate();
}