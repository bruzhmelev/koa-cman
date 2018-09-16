export const home = [
        {
            text: 'Что поделать в пиццерии',
            stage: 'home',
            chance: 100,
            condition: [{round: [2, 2]}, {round: [4, 4]}, {round: [6, 6]}],
            priority: 1,
            auto: true,
            choices: [
                {
                    text: '',
                    outcomes: [
                        {type: 'ever', affect: {points: -1}, text:'Сейчас не время отдыхать'}
                    ]
                }
            ]
        },
        {
            text: 'Что поделать в пиццерии',
            stage: 'home',
            condition: {points: 1},
            chance: 100,
            choices: [
                {
                    text: 'Поговорить с менеджером',
                    outcomes: [
                        {type: 'ever', affect: {stats: {cha: 1}, points: -1}, text:'Менеджер научил вас навыкам фасилитации. Харизма повысилась'}
                    ]
                },
                {
                    text: 'Разгрузить ящики с томатами',
                    outcomes: [
                        {type: 'ever', affect: {stats: {str: 1}, points: -1, score: 300}, text:'Вы покачали мыщцы и немного заработал'}
                    ]
                },
                {
                    text: 'Клеить этикетки',
                    outcomes: [
                        {type: 'ever', affect: {stats: {dex: 1}, points: -1}, text:'Это нудное занятие тренирует ловкость'}
                    ]
                }
            ]
        }
    ];