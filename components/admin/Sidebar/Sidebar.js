import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup/LinksGroup";
import {
  openSidebar,
  closeSidebar,
  changeActiveSidebarItem,
} from "redux/actions/navigation";
import isScreen from "core/screenHelper";
import { logoutUser } from "redux/actions/auth";

// These are JS component files, not images, so they should be imported as components
// Import sidebar icons as components from their correct paths
import HomeIcon from "../../../public/images/e-commerce/sidebar/home.js";
import DownloadIcon from "../../../public/images/e-commerce/sidebar/download.js";
import BarIcon from "../../../public/images/e-commerce/sidebar/bar.js";
import FileIcon from "../../../public/images/e-commerce/sidebar/file.js";
import GiftIcon from "../../../public/images/e-commerce/sidebar/gift.js";
import GridIcon from "../../../public/images/e-commerce/sidebar/grid.js";
import PersonIcon from "../../../public/images/e-commerce/sidebar/person.js";
import PricetagIcon from "../../../public/images/e-commerce/sidebar/pricetag.js";
import SettingsIcon from "../../../public/images/e-commerce/sidebar/settings.js";
import ShoppingIcon from "../../../public/images/e-commerce/sidebar/shopping.js";

class Sidebar extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    router: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: true,
    activeItem: "",
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.doLogout = this.doLogout.bind(this);
  }

  onMouseEnter() {
    if (!this.props.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
      const paths = this.props.router.pathname.split("/");
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  onMouseLeave() {
    if (!this.props.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    }
  }

  doLogout() {
    this.props.dispatch(logoutUser());
  }

  render() {
    return (
      <div
        className={`${
          !this.props.sidebarOpened && !this.props.sidebarStatic
            ? s.sidebarClose
            : ""
        } ${s.sidebarWrapper}`}
      >
        <nav
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          className={s.root}
        >
          <header className={s.logo}>
            <span className={`${s.logoStyle} mx-1`}>
              Flatlogic<i>.</i>
            </span>
          </header>
          <ul className={s.nav}>
            <LinksGroup
              onActiveSidebarItemChange={(activeItem) =>
                this.props.dispatch(changeActiveSidebarItem(activeItem))
              }
              activeItem={this.props.activeItem}
              header="Home"
              link={`${this.props.currentUser ? "/admin/dashboard" : "/"}`}
              isHeader
              iconType="node"
              iconName={<HomeIcon />}
            />

            {this.props.currentUser &&
              this.props.currentUser.role === "admin" && (
                <LinksGroup
                  onActiveSidebarItemChange={(activeItem) =>
                    this.props.dispatch(changeActiveSidebarItem(activeItem))
                  }
                  activeItem={this.props.activeItem}
                  header="Orders"
                  link="/admin/orders"
                  isHeader
                  iconType="node"
                  iconName={<DownloadIcon />}
                />
              )}

            {this.props.currentUser &&
              this.props.currentUser.role === "admin" && (
                <LinksGroup
                  onActiveSidebarItemChange={(activeItem) =>
                    this.props.dispatch(changeActiveSidebarItem(activeItem))
                  }
                  activeItem={this.props.activeItem}
                  header="Products"
                  link="/admin/products"
                  isHeader
                  iconType="node"
                  iconName={<PricetagIcon />}
                />
              )}

            {this.props.currentUser &&
              this.props.currentUser.role === "admin" && (
                <LinksGroup
                  onActiveSidebarItemChange={(activeItem) =>
                    this.props.dispatch(changeActiveSidebarItem(activeItem))
                  }
                  activeItem={this.props.activeItem}
                  header="Users"
                  link="/admin/users"
                  isHeader
                  iconType="node"
                  iconName={<PersonIcon />}
                />
              )}

            {this.props.currentUser &&
              this.props.currentUser.role === "admin" && (
                <LinksGroup
                  onActiveSidebarItemChange={(activeItem) =>
                    this.props.dispatch(changeActiveSidebarItem(activeItem))
                  }
                  activeItem={this.props.activeItem}
                  header="Categories"
                  link="/admin/categories"
                  isHeader
                  iconType="node"
                  iconName={<BarIcon />}
                />
              )}
            {this.props.currentUser && (
              <LinksGroup
                onActiveSidebarItemChange={(activeItem) =>
                  this.props.dispatch(changeActiveSidebarItem(activeItem))
                }
                activeItem={this.props.activeItem}
                header="My Profile"
                link={`/admin/users/edit/${
                  this.props.currentUser && this.props.currentUser.id
                }`}
                isHeader
                iconType="node"
                iconName={<FileIcon />}
              />
            )}
            {this.props.currentUser && (
              <LinksGroup
                onActiveSidebarItemChange={(activeItem) =>
                  this.props.dispatch(changeActiveSidebarItem(activeItem))
                }
                activeItem={this.props.activeItem}
                header="Change Password"
                link="/admin/password"
                isHeader
                iconType="node"
                iconName={<SettingsIcon />}
              />
            )}
          </ul>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    activeItem: store.navigation.activeItem,
    currentUser: store.auth.currentUser,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
