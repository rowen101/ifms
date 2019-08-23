import Vue from "vue";
import Router from "vue-router";
import store from "../store.js";
import Login from "../views/Login.vue";
import FleetOwnerList from "../views/maintenance/FleetOwnerList.vue";
import FleetOwnerSetup from "../views/maintenance/FleetOwnerSetup.vue";
import BranchTrucker from "../views/maintenance/BranchTrucker.vue";
import DriverList from "../views/maintenance/DriverList.vue";
import DriverSetup from "../views/maintenance/DriverSetup.vue";
import FleetList from "../views/maintenance/FleetList.vue";
import FleetListsetup from "../views/maintenance/FleetSetup.vue";
import TransmasterList from "../views/maintenance/TransmasterList.vue";
import Transmastersetup from "../views/maintenance/TransmasterSetup.vue";
import LaneMaster from "../views/maintenance/LaneMaster.vue";
import LaneMastersetup from "../views/maintenance/LaneMastersetup.vue";
import CheckList from "../views/maintenance/CheckList.vue";
import CheckListSetup from "../views/maintenance/CheckListSetup.vue";
import ChecklistIndicatorList from "../views/maintenance/CheckListIndicatorList.vue";
import ChecklistIndicatorSetup from "../views/maintenance/CheckListIndicatorSetup.vue";
import Customer from "../views/maintenance/Customer.vue";
import CustomerSetup from "../views/maintenance/CustomerSetup.vue";
import FleetEntryList from "../views/activity/FleetEntry/FleetEntryList.vue";
import FleetEntrySetup from "../views/activity/FleetEntry/FleetEntrySetup.vue";

import TransferLane from "../views/activity/TransferLane/TransferLane.vue";
import TRSetup from "../views/activity/TransactionRegistrar/TRSetup.vue";
import FleetDepartureSetup from "../views/activity/FleetDeparture/FleetDepartureSetup.vue";
import FleetDeparture from "../views/activity/FleetDeparture/FleetDeparture.vue";
import TRActivity from "../views/activity/TransActivity/TRActivity.vue";
import TRActivitySelectedList from "../views/activity/TransActivity/TRActivitySelectedList.vue";

import FleetChecklist from "../views/activity/FleetChecklist/FleetChecklist.vue";
import FleetChecklistSetup from "../views/activity/FleetChecklist/FleetChecklistSetup.vue";
import ChecklistAttachment from "../views/activity/FleetChecklist/ChecklistAttachment.vue";

import ChecklistReport from "../views/Report/ChecklistReport.vue";

import FleetRegistryReport from "../views/Report/FleetRegistry.vue";

import WarehouseActivity from "../views/activity/WarehouseActivity/WarhouseActivity.vue";
import WarehouseActivityCard from "../views/activity/WarehouseActivity/WarhouseActivivtyCard.vue";
import AddWarehouseActivity from "../views/activity/WarehouseActivity/AddWarhouseActivity.vue";
// Containers
const DefaultContainer = () => import("@/containers/DefaultContainer");

// Views
const Dashboard = () => import("@/views/Dashboard");

Vue.use(Router);

let router = new Router({
  mode: "hash", // Demo is living in GitHub.io, so required!
  linkActiveClass: "open active",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      name: "Home",
      component: DefaultContainer,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "dashboard",
          name: "Main",
          component: Dashboard,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "/maintenance",
          redirect: "/Maintenance/636977056989346870",
          name: "Maintenance",
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            //Customer Menu
            {
              path: "/636977056989346870",
              name: "Customer",
              redirect: "/Maintenance/636977056989346870",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Maintenance/636977056989346870",
                  component: Customer,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/636977056989346870/new",
                  component: CustomerSetup,
                  name: "Customer Setup",
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/636977056989346870/modify/:id",
                  name: "Modify Setup",
                  component: CustomerSetup,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            //Lane Master
            {
              path: "636917878380103450",
              redirect: "/Maintenance/636917878380103450",
              name: "Lane Master",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Maintenance/636917878380103450",
                  component: LaneMaster,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/636917878380103450/new/lane-master",
                  name: "New Lane Master",
                  component: LaneMastersetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path:
                    "/Maintenance/636917878380103450/modify/lane-master/:id",
                  name: "Modify Lane Master",
                  component: LaneMastersetup,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            //trucker
            {
              path: "2017041901085014",
              redirect: "/Maintenance/2017041901085014",
              name: "Trucker List",
              meta: {
                requiresAuth: true
              },
              component: {
                render(c) {
                  return c("router-view");
                }
              },

              children: [
                {
                  path: "/Maintenance/2017041901085014/new/fleetowner",
                  name: "New Trucker",
                  component: FleetOwnerSetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/2017041901085014/modify/fleetowner/:id",
                  name: "Modify Trucker",
                  component: FleetOwnerSetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/2017041901085014",
                  component: FleetOwnerList,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            //driver
            {
              path: "2017041905404978",
              name: "Driver",
              redirect: "/Maintenance/2017041905404978",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Maintenance/2017041905404978/new/driver",
                  name: "New driver",
                  component: DriverSetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/2017041905404978/modify/driver/:id",
                  props: true,
                  name: "Modify driver",
                  component: DriverSetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/2017041905404978",
                  component: DriverList,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },

            //Checklist
            {
              path: "636917825011241771",
              name: "Indicator",
              redirect: "/Maintenance/636917825011241771",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Maintenance/636917825011241771/new/checklist",
                  name: "New Indicator",
                  component: CheckListSetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/636917825011241771/modify/checklist/:id",
                  props: true,
                  name: "Modify Indicator",
                  component: CheckListSetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/636917825011241771",
                  component: CheckList,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            //Checklist Indicator
            {
              path: "636917825233527778",
              name: "Checklist Indicator",
              redirect: "/Maintenance/636917825233527778",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path:
                    "/Maintenance/636917825233527778/new/checklist-indicator",
                  name: "New Checklist Indicator",
                  component: ChecklistIndicatorSetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path:
                    "/Maintenance/636917825233527778/modify/checklist-indicator/:id",
                  props: true,
                  name: "Modify Checklist Indicator",
                  component: ChecklistIndicatorSetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/636917825233527778",
                  component: ChecklistIndicatorList,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            //Vechicles
            {
              path: "2017041905420722",
              name: "Vehicles",
              redirect: "/Maintenance/2017041905420722",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Maintenance/2017041905420722/new/vehicles",
                  name: "Vehicles Setup",
                  component: FleetListsetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/2017041905420722/modify/vehicles/:id",
                  props: true,
                  name: "Modify Vehicles",
                  component: FleetListsetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/2017041905420722",
                  component: FleetList,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            //TransMaster Menu
            {
              path: "636859984536802183",
              name: "Transmaster List",
              redirect: "/Maintenance/636859984536802183",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },

              children: [
                {
                  path: "/Maintenance/636859984536802183",
                  component: TransmasterList,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Maintenance/636859984536802183/new/transmaster",
                  name: "Transmaster Setup",
                  component: Transmastersetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path:
                    "/Maintenance/636859984536802183/modify/transmaster/:id",
                  props: true,
                  name: "Modify Transmaster Setup",
                  component: Transmastersetup,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            {
              path: "636890335273978405",
              name: "Branch Trucker",
              component: BranchTrucker,

              meta: {
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: "/Activity",
          redirect: "/Activity/2017060404262345",
          name: "Activity",
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "2017060404262345",
              name: "Registrar",
              redirect: "/Activity/2017060404262345",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Activity/2017060404262345",
                  component: FleetEntryList,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Activity/2017060404262345/modify-fleet-registry/:id",
                  props: true,
                  name: "Update Registrar",
                  component: FleetEntrySetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Activity/2017060404262345/new-fleet-registry",
                  props: true,
                  name: "New Registrar",
                  component: FleetEntrySetup,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            //Tranfer Lane
            {
              path: "636975700154560532",
              name: "Transfer Lane",
              component: TransferLane,
              meta: {
                requiresAuth: true
              }
            },
            //Warehose Activity
            {
              path: "636977057383879632",
              name: "Warehouse Activity",
              redirect: "/Activity/636977057383879632",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Activity/636977057383879632",
                  component: WarehouseActivity,
                  meta: {
                    requiresAuth: true
                  }
                },

                {
                  path: "/Activity/636977057383879632/sqid/:id",
                  props: true,
                  name: "Warehouse Activity Card",
                  component: WarehouseActivityCard,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Activity/636977057383879632/new-activity",
                  props: true,
                  name: "Create Warehouse Activity",
                  component: AddWarehouseActivity,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Activity/636977057383879632/modify/:id",
                  props: true,
                  name: "Update Warehouse Activity",
                  component: AddWarehouseActivity,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            //Trans Activity
            {
              path: "636859985185080849",
              name: "Transaction Activity",
              redirect: "/Activity/636859985185080849",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Activity/636859985185080849",
                  component: TRActivity,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path:
                    "/Activity/636859985185080849/select-tranActivity-entry/transActivity/:id",
                  props: true,
                  name: "Select Trans Activity",
                  component: TRActivitySelectedList,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            {
              path: "2017060610325948",
              name: "Fleet Departure",
              redirect: "/Activity/2017060610325948",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Activity/2017060610325948",
                  component: FleetDeparture,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Activity/2017060610325948/departure-setup/:id",
                  props: true,
                  name: "Fleet Departure Setup",
                  component: FleetDepartureSetup,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            },
            {
              path: "636857454684495987",
              name: "Transaction Registrar",
              component: TRSetup,
              meta: {
                requiresAuth: true
              }
            },
            //Fleet Checklist
            {
              path: "636892437634740910",
              name: "Fleet Checklist",
              redirect: "/Activity/636892437634740910",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },

              children: [
                {
                  path: "/Activity/636892437634740910",
                  component: FleetChecklist,
                  meta: {
                    requiresAuth: true
                  }
                },

                {
                  path:
                    "/Activity/636892437634740910/setup/fleet-checklist/:id",

                  name: "Fleet Checklist Setup",
                  component: FleetChecklistSetup,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Activity/636892437634740910/attactment/:id",

                  component: ChecklistAttachment,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            }
          ]
        },
        // Report Menu
        {
          path: "/report",
          redirect: "/Report/636427046438810000",
          name: "Report",
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "/636427046438810000",
              name: "Fleet Registry",
              redirect: "/Report/636427046438810000",
              component: {
                render(c) {
                  return c("router-view");
                }
              },
              meta: {
                requiresAuth: true
              },
              children: [
                {
                  path: "/Report/636427046438810000",
                  component: FleetRegistryReport,
                  meta: {
                    requiresAuth: true
                  }
                },
                {
                  path: "/Report/636427046438810000/report/checklist-by-id/:id",
                  props: true,
                  name: "Checklist Report",
                  component: ChecklistReport,
                  meta: {
                    requiresAuth: true
                  }
                }
              ]
            }
          ]
        }
      ]
    },

    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log(store.getters.isLoggedIn);
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
