import { Plugin } from 'chart.js';

export const bgColor: Plugin = {
  id: 'bgColor',
  beforeDraw: (chart) => {
    const { ctx, width, height } = chart
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}