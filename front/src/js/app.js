import { EventEmitter } from '@/js/helpers/EventEmitter';
import { initSymbolSprite } from '@/js/helpers/symbolSprite';
import { resizer } from '@/js/helpers/resizer';
import { sleep } from '@/js/utils';

const emitter = new EventEmitter();

initSymbolSprite('./../images/symbol-sprite.html', 24);

import('@/js/components/component').then(({ fireComponent }) => fireComponent());

sleep(5000).then(() => {
    // eslint-disable-next-line no-console
    console.log('end');
});

resizer({ emitter, ms: 300 });
