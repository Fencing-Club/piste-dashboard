import { INavLink } from "@fluentui/react"

export interface INavTag {
  group?: string
  order?: number
  link?: Omit<Partial<INavLink>, "url">
}

export interface IPageItem {
  name: string
  url: string
  tags?: Record<string, INavTag>
  children?: IPageItem[]
}

export const sitemap: IPageItem[] = [
  {
    name: "Overview",
    url: "/",
    tags: {
      nav: {
        link: {
          icon: "ViewDashboard",
        },
      },
      breadcrumb: { link: { name: "Home" } },
    },
    children: [
      {
        name: "Calendar",
        url: "calendar/",
        tags: {
          nav: { link: { icon: "Calendar", disabled: true } },
          breadcrumb: {},
        },
      },
      {
        name: "Clubs",
        url: "clubs/",
        tags: {
          nav: { link: { icon: "Teamwork", disabled: true } },
          breadcrumb: {},
        },
      },
      {
        name: "Billing",
        url: "billing/",
        tags: {
          nav: { link: { icon: "PaymentCard", disabled: true } },
          breadcrumb: {},
        },
      },
      {
        name: "Assessments",
        url: "assessments/",
        tags: {
          nav: { group: "Club", link: { icon: "TestPlan", disabled: false } },
          breadcrumb: {},
        },
        children: [
          {
            name: "View assessment",
            url: "[assessmentId]/",
            tags: {
              breadcrumb: {},
            },
            children: [
              {
                name: "Submit evaluation",
                url: "submit/",
                tags: {
                  breadcrumb: {},
                },
              },
              {
                name: "Edit evaluation",
                url: "[evaluationId]/",
                tags: {
                  breadcrumb: {},
                },
              },
            ],
          },
        ],
      },
      {
        name: "Classes",
        url: "classes/",
        tags: {
          nav: { group: "Club", link: { icon: "Education", disabled: true } },
          breadcrumb: {},
        },
      },
      {
        name: "Coaching",
        url: "coaching/",
        tags: {
          nav: { group: "Club", link: { icon: "UserEvent", disabled: true } },
          breadcrumb: {},
        },
      },
      {
        name: "Challenges",
        url: "challenges/",
        tags: {
          nav: { group: "Club", link: { icon: "Diamond", disabled: false } },
          breadcrumb: {},
        },
      },
      {
        name: "Armory",
        url: "armory/",
        tags: {
          nav: {
            group: "Club",
            link: { icon: "DeveloperTools", disabled: true },
          },
          breadcrumb: {},
        },
      },
      {
        name: "Store",
        url: "store/",
        tags: {
          nav: {
            group: "Club",
            link: { icon: "OfficeStoreLogo", disabled: true },
          },
          breadcrumb: {},
        },
      },
      {
        name: "Clinics",
        url: "clinics/",
        tags: {
          nav: {
            group: "Events",
            link: { icon: "Certificate", disabled: true },
          },
          breadcrumb: {},
        },
      },
      {
        name: "Tournaments",
        url: "tournaments/",
        tags: {
          nav: { group: "Events", link: { icon: "Trophy2", disabled: true } },
          breadcrumb: {},
        },
      },
      {
        name: "Profile",
        url: "profile/",
        tags: {
          breadcrumb: {},
        },
      },
    ],
  },
]
