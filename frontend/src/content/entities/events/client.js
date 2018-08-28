export const client = [
        {
            text: 'По умолчанию у клиента',
            stage: 'client',
            auto: true,
            chance: 40,
            choices: [
                {
                    text: '',
                    requirement: {stats: {cha: 3}, growth: 1},
                    outcomes: [
                        {type: 'good', condition: {late: false}, affect: {done: true, pay: true, score: 100}, text:'Отличный клиент, каких мало - дал 100 рублей на чай'},
                        {type: 'good', condition: {late: true}, affect: {done: true, pay: false}, text:'Вы опоздали - заказ бесплатно'},
                        {type: 'good', condition: {late: true}, chance: 50, affect: {done: true, pay: true}, text:'Вы опоздали - но вы такой обаятельный, что клиент заплатил всю сумму'},
                        {type: 'tidy', condition: {late: false}, affect: {done: true, pay: true, score: 50}, text:'Отличный клиент, каких мало - дал 50 рублей на чай'},
                        {type: 'tidy', condition: {late: true}, affect: {done: true, pay: false}, text:'Вы опоздали - заказ бесплатно'},
                        {type: 'poor', condition: {late: false}, affect: {done: true, pay: true}, text:'Обычный клиент, каких много, чаевых не дал'},
                        {type: 'poor', condition: {late: true}, affect: {done: true, pay: false}, text:'Вы опоздали - заказ бесплатно'},
                        {type: 'good', condition: {late: true}, chance: 30, affect: {done: true, pay: true}, text:'Вы опоздали, но такому обаятельному курьеру разве можно не заплатить'},
                        {type: 'ever', condition: {late: true}, chance: 10, affect: {done: true, pay: true}, text:'Вы опоздали, но клиент пожалел работягу-курьера и заплатил'},
                    ]
                }
            ]
        },
        {
            text: 'Быковатый клиент отказывается платить',
            stage: 'client',
            chance: [
                {condition: {target: 'luber'}, value: 60},
                {condition: {target: 'srcrict'}, value: 20},
                {condition: {target: 'luber', stats: {cha: [0, 0]}}, value: 100},
                {condition: {target: 'srcict', stats: {cha: [0, 0]}}, value: 70}
            ],
            choices: [
                {
                    text: 'Заставить заплатить силой',
                    requirement: {stats: {str: 3}, growth: 1},
                    outcomes: [
                        {type: 'good', affect: {done: true, pay: true, score: -1000}, text: 'Не зря вы качались долгими вечерами в спортзале. Быки пасуют перед вами. Правда клиент пожаловался на вас менеджеру и как результат вы оштрафованы на 1000 рублей'},
                        {type: 'tidy', affect: {done: true, pay: false, stats: {dex: -1}}, text: 'Вам бы еще подкачать мускулы. Этот мужик просто спустил вас с лестницы. Немного побаливает нога и -1 к ловкости'},
                        {type: 'poor', affect: {done: true, pay: false, stats: {dex: -1, cha: -1}}, text: 'Перестаньте переоценивать свои боевые способности. Этот мужик втащил вам с правой и спустил вас с лестницы. Немного побаливает нога, помялось лицо и -1 к ловкости и харизме'},
                    ]
                },
                {
                    text: 'Простить, понять, обнять',
                    requirement: {stats: {dex: 3}, growth: 1},
                    outcomes: [
                        {type: 'good', affect: {done: true, pay: true}, text: 'Ах вы, хитрюга и ловкач. Стащили таки деньги за заказ, пока обнимали этого беспредельщика'},
                        {type: 'tidy', affect: {done: true, pay: false}, text: 'Ну не всегда старый трюк будет получаться, не так ли? Надо больше практиковаться'},
                        {type: 'poor', affect: {done: true, pay: false}, text: 'Ах вы, хитрюга и ловкач. Задумали незаметно стащить кошелек? Сегодня не получилось'}
                    ]
                },
                {
                    text: 'Убедить жарким словом',
                    requirement: {stats: {cha: 3}, growth: 1},
                    outcomes: [
                        {type: 'good', affect: {done: true, pay: true, score: 100}, text: 'Блестящие навыки agile-коуча не пропали даром. Клиент заплатил и даже дал на чай в качестве извинений'},
                        {type: 'tidy', affect: {done: true, pay: true}, text: 'Ваш язык все еще подвешен, как надо. Клиент заплатил, но извинений не принес'},
                        {type: 'poor', affect: {done: true, pay: false}, text: 'Вашей харизмы явно недостаточно, чтобы убедить человека делать то, что он не хочет'}
                    ]
                }
            ]
        }
    ];