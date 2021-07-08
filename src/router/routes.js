// 观看页面
const Watch = () => import('src/pages/watch/watch/index')
const InviteCard = () => import('src/pages/invite/card')
// 被踢出
const kicked = () => import('src/pages/watch/kicked')
// 空页面
const empty = () => import('src/pages/watch/empty')
const emptyOther = () => import('src/pages/other/other-page')
const noneOther = () => import('src/pages/other/none')

export default [
  {
    path: '/watch/:id',
    name: 'watch',
    component: Watch
  },
  {
    path: '/invite-card/:id',
    name: 'invite-card',
    component: InviteCard
  },
  {
    path: '/kicked',
    name: 'kicked',
    component: kicked
  },
  {
    path: '/empty',
    name: 'empty',
    component: empty
  },
  {
    path: '/other/:type',
    name: 'other',
    component: emptyOther
  },
  {
    path: '/none',
    name: 'none',
    component: noneOther
  }
]
