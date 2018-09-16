import { concat } from 'lodash';
import { home } from '../../content/entities/events/home';
import { road } from '../../content/entities/events/road';
import { location } from '../../content/entities/events/location';
import { client } from '../../content/entities/events/client';

export const events = concat(
    home,
    road,
    location,
    client
);