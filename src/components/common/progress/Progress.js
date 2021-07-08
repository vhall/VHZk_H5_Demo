/**
 *
 *A RX,RY,XROTATION,FLAG1,FLAG2,X,Y
 * RX,RY指所在椭圆的半轴大小
 * XROTATION指椭圆的X轴与水平方向顺时针方向夹角，可以想像成一个水平的椭圆绕中心点顺时针旋转XROTATION的角度。
 * FLAG1只有两个值，1表示大角度弧线，0为小角度弧线。
 * FLAG2只有两个值，确定从起点至终点的方向，1为顺时针，0为逆时针
 * X,Y为终点坐标
 * @export
 * @class Progress
 */
export default class Progress {
  set progress (val) {
    let calcPosition = (x, y, r, a) => {
      let ta = (360 - a) * Math.PI / 180
      let tx = r * Math.cos(ta)
      let ty = r * Math.sin(ta)
      return {
        x: x + tx,
        y: y - ty
      }
    }

    this.degress = val * 360
    this.rad = this.degress * Math.PI / 180
    let start = -90
    let end = this.degress - 90
    this.flag1 = window.Number(end - start > 180)
    this.flag2 = 1
    let s = calcPosition(this.x, this.y, this.r, start)
    let e = calcPosition(this.x, this.y, this.r, end)
    this._path = 'M' + s.x + ',' + s.y + 'A' + this.r + ',' + this.r + ',0,' + this.flag1 + ',' + this.flag2 + ',' + e.x + ',' + e.y
  }

  get progress () {
    return this._path
  }

  constructor (opt = {}) {
    this.x = opt.x
    this.y = opt.y
    this.r = opt.r
  }
}
