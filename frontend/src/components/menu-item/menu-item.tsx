import { Menu } from 'antd'
import styled from 'styled-components'

export const MenuCustom = styled(Menu)`
border-inline-end: none!important;
padding-left: 0!important;
& .ant-menu-item,& .ant-menu-submenu .ant-menu-submenu-title {
    border-radius: 0;

    width:100%!important;
    padding-left: 12px!important;
    color: #212B36;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    &.ant-menu-item-selected a>p{
        font-weight: 600!important;
    }
}
& .ant-menu-sub .ant-menu-item {
    height: fit-content!important;
    border-radius: 0;
    padding: 8px 0px 8px 44px;
    & a {
        &>p {
            padding:0 0 0 34px;
            white-space: wrap;
            margin: 0 !important;
        }
    }
}

 
`
