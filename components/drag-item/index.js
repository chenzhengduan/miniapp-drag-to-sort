Component({
    relations: {
        '../drag-to-sort/index': {
            type: 'parent', // 关联的目标节点应为父节点
            linked: function(target) {
                const {dragY, dragX} = target.data
                const systemInfo = wx.getSystemInfoSync()
                this.parent = target
                this.setData({ dragY, dragX, window: {width: systemInfo.windowWidth, height: systemInfo.windowHeight}, linked: true })
                this.updatePosList = data => {
                    const {rect, dataset} = data
                    target.posList = target.posList || []
                    target.posList.push({originalIndex: dataset.idx, currentIndex: dataset.idx, size: {width: rect.width, height: rect.height}, translate: {x: 0, y: 0}})
                    target.posListLen = target.posListLen || 0
                    target.posListLen += 1
                    if (target.posListLen == target.data.length) {
                        target.posList = target.posList.sort(this.arrayCompare('currentIndex'))
                        target.allChildLinked(target.posList)
                    }
                }
            }
        }
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        idx: {
            type: Number,
            value: 0
        }
    },
    data: {
        
    },
    methods: {
        getScrollerRect() {
            return
            this.parent.getScrollerRect()
        },
        updatePos({pos, updateIndex, oldPos, newPos}) {
            console.log('updatePos', pos, updateIndex, oldPos, newPos)
            let posList = this.parent.posList.map(item => {
                if (item.originalIndex == pos.originalIndex) {
                    return pos
                } else {
                    return item
                }
            })
            this.parent.posList = posList
            if (updateIndex !== undefined) {
                this.parent.noticeChildInited(updateIndex)
            } else {
                this.parent.noticeChildInited()
            }
            if (oldPos != newPos) {
                this.parentPosChange({oldPos, newPos})
            }
        },
        updatePosDate(posList) {
            this.setData({posList})
        },
        arrayCompare (property) {
            return function (a, b) {
                var value1 = a[property]
                var value2 = b[property]
                return value1 - value2
            }
        },
        log(data) {
            console.log(data)
        },
        parentChange(data) {
            this.parent.change(data)
        },
        parentPosChange(data) {
            this.parent.posChange(data)
        }
    }
})