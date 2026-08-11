/**
 * One-off cancelled departures.
 * Keys in byDirection match copy.direction.* values after formatDirectionName.
 */
export const scheduleCancellations = [
  {
    routeId: '533',
    date: '2026-08-11',
    byDirection: {
      'Из Янино': [
        '05:46',
        '06:58',
        '08:10',
        '10:10',
        '13:10',
        '16:10',
        '17:26',
        '18:30',
        '21:10',
      ],
      'С Ладожской': [
        '06:16',
        '07:28',
        '08:40',
        '10:40',
        '13:40',
        '16:40',
        '17:56',
        '19:00',
        '21:40',
      ],
    },
  },
]
