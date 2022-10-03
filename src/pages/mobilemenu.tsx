import React, { useState, useRef, useEffect } from 'react'
import {
  MobileMenu,
  RootMenuItem,
  CloseButton,
  MenuHeaderTitle,
  MenuServicePoints,
  MobileMenuItem,
  MenuStateWrapper,
} from '@postidigital/posti-components/build/page-sections/MobileMenu'
import { MobileMenuItemProps, MobileMenuProps, CloseButtonAria, CloseButtonAriasLabels } from '@postidigital/posti-components/build/page-sections/MobileMenu/MobileMenu.types'
import { NavigationItemProps } from '@postidigital/posti-components/build/page-sections/TopBar/TopBar.types'
import {
  ArchiveIcon,
  CartIcon,
  EnvelopeIcon,
  HeartIcon,
  ParcelsIcon,
  PinIcon,
  PostcardIcon,
  SendParcelIcon,
  StampIcon,
} from '@postidigital/posti-components/build/design-tokens/icons'
import {
  MenuContent,
  MenuHeader,
  MenuHeaderButtons,
  RootMenu,
  MobileMenuLanguageSelection,
  MenuContentGroup,
} from '@postidigital/posti-components/build/page-sections/MobileMenu/MobileMenu.style'
import Button from '@postidigital/posti-components'
import { getParent, getSelectedItem } from '@postidigital/posti-components/build/page-sections/MobileMenu/util'
import { handleNavItemClick, checkAriaCurrent } from '@postidigital/posti-components/build/page-sections/Navigation/navigationItemUtils'
import useOnClickOutside from 'use-onclickoutside'

const disabledControl = { control: 'disabled' }

const supportedLanguages = [
  { lang: 'EN', langAriaLabel: 'English' },
  { lang: 'SV', langAriaLabel: 'Svenska' },
  { lang: 'FI', langAriaLabel: 'Suomi' },
]

const topLevelMenuItems: MobileMenuItemProps[] = [
  {
    id: '0',
    label: 'Parcels and tracking',
    value: 'sendParcelOrLetter',
    redirectsToSubMenu: true,
    chevronAriaLabel: 'Send a parcel or letter submenu',
    icon: SendParcelIcon,
    children: [
      {
        id: '00',
        label: 'Send letter or postcard',
        value: 'sendParcel',
        icon: ParcelsIcon,
        parentId: '0',
        redirectsToSubMenu: true,
        children: [],
      },
      {
        id: '01',
        label: 'Mail delivery and change address',
        value: 'sendLetter',
        icon: EnvelopeIcon,
        parentId: '0',
        redirectsToSubMenu: true,
        children: [],
      },
    ],
  },
  {
    id: '1',
    label: 'Posti online shop',
    value: 'postiOnlineShop',
    redirectsToSubMenu: true,
    chevronAriaLabel: 'Posti online shop submenu',
    icon: CartIcon,
    children: [
      {
        id: '10',
        label: 'Buy stamps',
        value: 'stamps',
        icon: StampIcon,
        parentId: '1',
        redirectsToSubMenu: true,
        children: [
          {
            id: '100',
            label: 'Send something',
            value: 'Send something',
            redirectsToSubMenu: true,
            chevronAriaLabel: 'Send a parcel or letter submenu',
            icon: SendParcelIcon,
            parentId: '10',
            children: [
              {
                id: '1000',
                label: 'Buy postcards',
                value: 'postcards',
                icon: PostcardIcon,
                parentId: '100',
                redirectsToSubMenu: true,
                children: [],
              },
              {
                id: '1001',
                label: 'Buy personalized stamps',
                value: 'personalizedStamps',
                parentId: '100',
                redirectsToSubMenu: true,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '11',
        label: 'Postcards',
        value: 'postcards',
        icon: PostcardIcon,
        parentId: '1',
        redirectsToSubMenu: true,
        children: [],
      },
      {
        id: '12',
        label: 'Personalized stamps',
        value: 'personalizedStamps',
        parentId: '1',
        redirectsToSubMenu: true,
        children: [],
      },
    ],
  },
]

const ROOT_OPTIONS: MobileMenuItemProps[] = [
  { id: '2', label: 'My Pickup point', value: 'myPickupPoint', icon: PinIcon },
  { id: '3', label: 'Archive', value: 'archive', icon: ArchiveIcon },
  { id: '4', label: 'Contact us', value: 'contactUs', icon: HeartIcon },
]

const TOPBAR_OPTIONS: NavigationItemProps[] = [
  { title: 'Personal', href: '#personal', active: true },
  { title: 'Consumers', href: '#consumers', active: false },
  { title: 'Customer Support', href: '#customersupport', active: false },
]

const navigationState = {
  topLevelMenuItems,
  currentPage: ROOT_OPTIONS[1],
  rootPage: TOPBAR_OPTIONS[1],
  rootMenuItems: TOPBAR_OPTIONS,
}

const meta: Meta = {
  title: 'Page Sections/Mobile Menu',
  component: MobileMenu,
  subcomponents: { MobileMenuItem },
  parameters: {
    docs: {
      source: {
        language: 'jsx',
        type: 'code',
      },
    },
    jest: ['MobileMenu'],
  },
  args: {
    hasServicePointsItem: true,
    hasLanguageSelection: true,
    hasRootLevelItems: true,
    isBusiness: false,
    handleOutsideClick: (e) => {
      console.log('outside click')
    },
    servicePointsItem: {
      href: '#',
      title: 'Service Points',
    },
  },
  argTypes: {
    closeButtonAriaLabel: {
      control: { type: 'select' },
      options: Object.values(CloseButtonAria),
    },
    isBusiness: { control: 'boolean' },
    hasServicePointsItem: { control: 'boolean' },
    hasLanguageSelection: { control: 'boolean' },
    hasRootLevelItems: { control: 'boolean' },
    handleOutsideClick: disabledControl,
    currentPage: disabledControl,
    servicePointsItem: disabledControl,
    openMenu: disabledControl,
  },
}
export default meta

export const Default: Story<
  MobileMenuProps & {
    closeButtonAriaLabel: keyof typeof CloseButtonAria
    hasServicePointsItem: boolean
    hasLanguageSelection: boolean
    hasRootLevelItems: boolean
    servicePointsItem: NavigationItemProps
  }
> = (args) => {
  const [locale, setLocale] = useState('EN')
  const [navState, setNavigationState] = useState(navigationState)
  const selectedItem = useRef(getSelectedItem(topLevelMenuItems))
  const [selectedOption, setSelectedOption] = useState<MobileMenuItemProps>(selectedItem.current)
  const buttonRef = useRef<HTMLButtonElement>()
  const closeButtonRef = useRef<HTMLButtonElement>()
  const rootRef = useRef<HTMLDivElement>()

  const onMenuItemSelect = (option: MobileMenuItemProps) => {
    setSelectedOption(option)
  }

  const handleBackButtonClick = () => {
    const parentSelectedItem = getParent(navState.topLevelMenuItems, selectedItem.current.parentId)
    const updatedNavState = { ...navState }
    updatedNavState.topLevelMenuItems.forEach(function iter(item) {
      item.selected = false
      if (parentSelectedItem && parentSelectedItem.id === item.id) {
        parentSelectedItem.selected = true
      }
      Array.isArray(item.children) && item.children.forEach(iter)
    })
    if (parentSelectedItem) {
      selectedItem.current = parentSelectedItem
    } else {
      selectedItem.current = null
    }
    setNavigationState(updatedNavState)
  }

  const handleClickLanguageSelection = (locale: string) => {
    setLocale(locale)
  }

  const handleMenuArrowClick = (item: MobileMenuItemProps) => {
    selectedItem.current = item
    const updatedNavState = { ...navState }
    updatedNavState.topLevelMenuItems.forEach(function iter(item) {
      item.selected = item.id === item.id
      Array.isArray(item.children) && item.children.forEach(iter)
    })
    setNavigationState(updatedNavState)
  }

  const MenuWrapper = ({ isOpen, setIsOpen }) => {
    useEffect(() => {
      if (!isOpen) {
        buttonRef.current?.focus()
      } else {
        closeButtonRef.current?.focus()
      }
    }, [isOpen])

    const handleClose = (e) => {
      setIsOpen(false)
      e.stopPropagation()
    }

    const handleOpen = (e) => {
      setIsOpen(true)
      e.stopPropagation()
    }

    const handleOutsideClick = (e: Event) => {
      setIsOpen(false)
      args.handleOutsideClick
    }

    useOnClickOutside(rootRef, handleOutsideClick)

    return (
      <div ref={rootRef}>
        <MobileMenu {...args}>
          <MenuHeader>
            <MenuHeaderButtons>
              <CloseButton
                ref={closeButtonRef}
                onClick={handleClose}
                aria-label={CloseButtonAriasLabels[args.closeButtonAriaLabel]}
              />
              <RootMenu>
                {navigationState.rootMenuItems.map((item, index) => {
                  return (
                    <RootMenuItem
                      isActive={item.active}
                      key={`${item.title}-${index}`}
                      href={item.href}
                      onClick={(e) => handleNavItemClick(item, e)}
                      aria-current={checkAriaCurrent(item, navigationState.rootPage)}
                      title={item.title}
                    />
                  )
                })}
              </RootMenu>
            </MenuHeaderButtons>
            {selectedItem.current && (
              <MenuHeaderTitle onClick={handleBackButtonClick} aria-label="Go back">
                {selectedItem.current.label}
              </MenuHeaderTitle>
            )}
          </MenuHeader>

          <MenuContent>
            <MenuContentGroup>
              {!selectedItem.current
                ? navigationState.topLevelMenuItems.map((opt) => {
                    return (
                      <MobileMenuItem
                        aria-label={opt.label}
                        id={opt.id}
                        key={opt.id}
                        value={opt.value}
                        onSelect={() => onMenuItemSelect(opt)}
                        onButtonClick={() => handleMenuArrowClick(opt)}
                        icon={opt.icon}
                        redirectsToSubMenu={opt.redirectsToSubMenu}
                        selected={selectedOption?.value === opt.value}
                        chevronAriaLabel={opt.chevronAriaLabel}
                        label={opt.label}
                      />
                    )
                  })
                : [selectedItem.current].map((validOption) =>
                    validOption.children.map((child) => {
                      return (
                        <MobileMenuItem
                          aria-label={child.label}
                          id={child.id}
                          key={child.id}
                          value={child.value}
                          onSelect={() => onMenuItemSelect(child)}
                          onButtonClick={() => handleMenuArrowClick(child)}
                          icon={child.icon}
                          selected={selectedOption?.value === child.value}
                          redirectsToSubMenu={child.redirectsToSubMenu}
                          chevronAriaLabel={child.chevronAriaLabel}
                          label={child.label}
                        />
                      )
                    })
                  )}
            </MenuContentGroup>
            {args.hasRootLevelItems && (
              <MenuContentGroup>
                {ROOT_OPTIONS.map((opt) => {
                  return (
                    <MobileMenuItem
                      key={opt.id}
                      id={opt.id}
                      value={opt.value}
                      selected={selectedOption?.value === opt.value}
                      icon={opt.icon}
                      onSelect={() => onMenuItemSelect(opt)}
                      label={opt.label}
                    />
                  )
                })}
              </MenuContentGroup>
            )}
            {(args.hasServicePointsItem || args.hasLanguageSelection) && (
              <MenuContentGroup>
                {args.hasServicePointsItem && (
                  <MenuServicePoints title={args.servicePointsItem.title} href={args.servicePointsItem.href} />
                )}
                {args.hasLanguageSelection && (
                  <MobileMenuLanguageSelection
                    supportedLanguages={supportedLanguages}
                    languageLabel="Language"
                    language={locale}
                    onLanguageToggle={handleClickLanguageSelection}
                    aria-label="Selection of languages"
                  />
                )}
              </MenuContentGroup>
            )}
          </MenuContent>
        </MobileMenu>
        <Button ref={buttonRef} size="sm" onClick={handleOpen}>
          Open menu
        </Button>
      </div>
    )
  }

  return (
    <MenuStateWrapper>
      {({ isOpen, setIsOpen }) => <MenuWrapper isOpen={isOpen} setIsOpen={setIsOpen} />}
    </MenuStateWrapper>
  )
}

const preSelectedTopLevelMenuItems: MobileMenuItemProps[] = [
  {
    id: '0',
    label: 'Parcels and tracking',
    value: 'sendParcelOrLetter',
    redirectsToSubMenu: true,
    chevronAriaLabel: 'Send a parcel or letter submenu',
    children: [
      { id: '3', label: 'Send letter or postcard', value: 'sendParcel', selected: true, parentId: '0', children: [] },
      { id: '4', label: 'Mail delivery and change address', value: 'mailDelivery', parentId: '0', children: [] },
      { id: '5', label: 'Mail delivery interruption', value: 'deliveryInterruption', parentId: '0', children: [] },
    ],
  },
  {
    id: '1',
    label: 'Letters and mail',
    value: 'postiOnlineShop',

    redirectsToSubMenu: true,
    chevronAriaLabel: 'Posti online shop submenu',
    children: [
      { id: '6', label: 'Stamps', value: 'stamps', parentId: '1', children: [] },
      { id: '7', label: 'Postcards', value: 'postcards', parentId: '1', children: [] },
      { id: '8', label: 'Personalized stamps', value: 'personalizedStamps', parentId: '1', children: [] },
    ],
  },
  {
    id: '2',
    label: 'OmaPosti',
    value: 'omaPosti',
    children: [],
  },
]

const preSelectedNavigationState = {
  topLevelMenuItems: preSelectedTopLevelMenuItems,
  rootMenuItems: TOPBAR_OPTIONS,
}

export const PreSelectedItemMobileMenu: Story<
  MobileMenuProps & {
    closeButtonAriaLabel: keyof typeof CloseButtonAria
    hasServicePointsItem: boolean
    hasLanguageSelection: boolean
    hasRootLevelItems: boolean
    servicePointsItem: NavigationItemProps
  }
> = (args) => {
  const [locale, setLocale] = useState('EN')
  const [navState, setNavigationState] = useState(preSelectedNavigationState)
  const selectedItem = useRef(getSelectedItem(preSelectedTopLevelMenuItems))
  const [selectedOption, setSelectedOption] = useState<MobileMenuItemProps>(selectedItem.current)
  const buttonRef = useRef<HTMLButtonElement>()
  const closeButtonRef = useRef<HTMLButtonElement>()
  const rootRef = useRef<HTMLDivElement>()

  const onMenuItemSelect = (option: MobileMenuItemProps) => {
    setSelectedOption(option)
  }

  const handleBackButtonClick = () => {
    const parentSelectedItem = getParent(navState.topLevelMenuItems, selectedItem.current.parentId)
    const updatedNavState = { ...navState }
    updatedNavState.topLevelMenuItems.forEach(function iter(item) {
      item.selected = false
      if (parentSelectedItem && parentSelectedItem.id === item.id) {
        parentSelectedItem.selected = true
      }
      Array.isArray(item.children) && item.children.forEach(iter)
    })
    if (parentSelectedItem) {
      selectedItem.current = parentSelectedItem
    } else {
      selectedItem.current = null
    }
    setNavigationState(updatedNavState)
  }

  const handleClickLanguageSelection = (locale: string) => {
    setLocale(locale)
  }

  const handleMenuArrowClick = (item: MobileMenuItemProps) => {
    selectedItem.current = item
    const updatedNavState = { ...navState }
    updatedNavState.topLevelMenuItems.forEach(function iter(item) {
      item.selected = item.id === item.id
      Array.isArray(item.children) && item.children.forEach(iter)
    })
    setNavigationState(updatedNavState)
  }

  const MenuWrapper = ({ isOpen, setIsOpen }) => {
    useEffect(() => {
      if (!isOpen) {
        buttonRef.current?.focus()
      } else {
        closeButtonRef.current?.focus()
      }
    }, [isOpen])

    const handleClose = (e) => {
      setIsOpen(false)
      e.stopPropagation()
    }

    const handleOpen = (e) => {
      setIsOpen(true)
      e.stopPropagation()
    }

    const handleOutsideClick = (e: Event) => {
      setIsOpen(false)
      args.handleOutsideClick
    }

    useOnClickOutside(rootRef, handleOutsideClick)

    return (
      <div ref={rootRef}>
        <MobileMenu {...args}>
          <MenuHeader>
            <MenuHeaderButtons>
              <CloseButton
                ref={closeButtonRef}
                onClick={handleClose}
                aria-label={CloseButtonAriasLabels[args.closeButtonAriaLabel]}
              />
              <RootMenu>
                {navigationState.rootMenuItems.map((item, index) => {
                  return (
                    <RootMenuItem
                      isActive={item.active}
                      key={`${item.title}-${index}`}
                      href={item.href}
                      onClick={(e) => handleNavItemClick(item, e)}
                      aria-current={checkAriaCurrent(item, navigationState.rootPage)}
                      title={item.title}
                    />
                  )
                })}
              </RootMenu>
            </MenuHeaderButtons>
            {selectedItem.current && (
              <MenuHeaderTitle onClick={handleBackButtonClick} aria-label="Go back">
                {selectedItem.current.label}
              </MenuHeaderTitle>
            )}
          </MenuHeader>
          <MenuContent>
            <MenuContentGroup>
              {!selectedItem.current
                ? navigationState.topLevelMenuItems.map((opt) => {
                    return (
                      <MobileMenuItem
                        aria-label={opt.label}
                        id={opt.id}
                        key={opt.id}
                        value={opt.value}
                        onSelect={() => onMenuItemSelect(opt)}
                        onButtonClick={() => handleMenuArrowClick(opt)}
                        icon={opt.icon}
                        redirectsToSubMenu={opt.redirectsToSubMenu}
                        selected={selectedOption?.value === opt.value}
                        chevronAriaLabel={opt.chevronAriaLabel}
                        label={opt.label}
                      />
                    )
                  })
                : [selectedItem.current].map((validOption) =>
                    validOption.children.map((child) => {
                      return (
                        <MobileMenuItem
                          aria-label={child.label}
                          id={child.id}
                          key={child.id}
                          value={child.value}
                          onSelect={() => onMenuItemSelect(child)}
                          onButtonClick={() => handleMenuArrowClick(child)}
                          icon={child.icon}
                          selected={selectedOption?.value === child.value}
                          redirectsToSubMenu={child.redirectsToSubMenu}
                          chevronAriaLabel={child.chevronAriaLabel}
                          label={child.label}
                        />
                      )
                    })
                  )}
            </MenuContentGroup>
            {args.hasRootLevelItems && (
              <MenuContentGroup>
                {ROOT_OPTIONS.map((opt) => {
                  return (
                    <MobileMenuItem
                      key={opt.id}
                      id={opt.id}
                      value={opt.value}
                      selected={selectedOption?.value === opt.value}
                      icon={opt.icon}
                      onSelect={() => onMenuItemSelect(opt)}
                      label={opt.label}
                    />
                  )
                })}
              </MenuContentGroup>
            )}
            {(args.hasServicePointsItem || args.hasLanguageSelection) && (
              <MenuContentGroup>
                {args.hasServicePointsItem && (
                  <MenuServicePoints title={args.servicePointsItem.title} href={args.servicePointsItem.href} />
                )}
                {args.hasLanguageSelection && (
                  <MobileMenuLanguageSelection
                    supportedLanguages={supportedLanguages}
                    languageLabel="Language"
                    language={locale}
                    onLanguageToggle={handleClickLanguageSelection}
                    aria-label="Selection of languages"
                  />
                )}
              </MenuContentGroup>
            )}
          </MenuContent>
        </MobileMenu>
        <Button ref={buttonRef} size="sm" onClick={handleOpen}>
          Open menu
        </Button>
      </div>
    )
  }

  return (
    <MenuStateWrapper>
      {({ isOpen, setIsOpen }) => <MenuWrapper isOpen={isOpen} setIsOpen={setIsOpen} />}
    </MenuStateWrapper>
  )
}