import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { postSearch, userSearch } from '../../state/actionCreators/searchActionCreators';

import ProfileIcon from '../../components/ProfileIcon';
import SearchDark from '../../../public/icons/search_dark.svg';
import DefaultBackground from '../../../public/images/default_background.png';

import './HeaderBar.scss';

const HeaderBar = ({
  user, match, location, history, ...props
}) => {
  const [query, setQuery] = React.useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    history.push(`/search?query=${query}`);
  };

  return (
    <div id="header-bar-container">
      <header>
        <form onSubmit={onSubmit}>
          <SearchDark />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or posts or users"
          />
        </form>

        <div id="header-bar-profile-container">
          <p>Hey {user?.firstName || 'there'}!</p>
          <ProfileIcon
            imgUrl={user?.profileUrl || ''}
            username={user?.username || ''}
            uid={user._id}
          />
        </div>
      </header>

      <img
        id="header-bar-banner"
        src={user?.backgroundUrl || DefaultBackground}
        alt="profile background"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.users?.[state.auth.userId] || {},
});

export default withRouter(connect(mapStateToProps, { postSearch, userSearch })(HeaderBar));
