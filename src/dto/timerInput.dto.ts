import { NumberOption } from 'necord';

export class TimerInput {
  @NumberOption({
    name: 'minutos',
    description: 'Digite os minutos',
    required: false,
    min_value: 0,
  })
  minutes: number | null;

  @NumberOption({
    name: 'segundos',
    description: 'Digite os segundos',
    required: false,
    min_value: 0,
  })
  seconds: number | null;
}
