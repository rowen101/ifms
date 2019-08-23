export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary'
      }
    },
        {
      title: true,
      name: 'Maintenance',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },  {
      name: 'Maintenance',
      url: '/maintenance',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'FleetOwner',
          url: '/maintenance/fsdfasd',
          icon: 'icon-puzzle'
        },
        {
          name: 'Cards',
          url: '/base/cards',
          icon: 'icon-puzzle'
        },
        
      ]
    },
  ]
}
