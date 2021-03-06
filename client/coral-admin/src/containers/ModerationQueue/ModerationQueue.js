import React, {PropTypes} from 'react';
import styles from './ModerationQueue.css';

import ModerationKeysModal from 'components/ModerationKeysModal';
import ModerationList from 'components/ModerationList';
import BanUserDialog from 'components/BanUserDialog';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';

const lang = new I18n(translations);

const ModerationQueue = (props) => (
  <div>
    <div className='mdl-tabs'>
      <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
        <a href='#all'
           onClick={(e) => {
             e.preventDefault();
             props.onTabClick('all');
           }}
           className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'all' ? styles.active : ''}`}
        >
          {lang.t('modqueue.all')}
        </a>
        {
          props.enablePremodTab
          ? <a href='#premod'
             onClick={(e) => {
               e.preventDefault();
               props.onTabClick('premod');
             }}
             className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'premod' ? styles.active : ''}`}>
            {lang.t('modqueue.premod')}
          </a>
          : null
        }
        <a href='#account'
          onClick={(e) => {
            e.preventDefault();
            props.onTabClick('account');
          }}
         className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'account' ? styles.active : ''}`}>
         {lang.t('modqueue.account')}
       </a>
        <a href='#rejected'
           onClick={(e) => {
             e.preventDefault();
             props.onTabClick('rejected');
           }}
           className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'rejected' ? styles.active : ''}`}
        >
          {lang.t('modqueue.rejected')}
        </a>
        <a href='#flagged'
           onClick={(e) => {
             e.preventDefault();
             props.onTabClick('flagged');
           }}
           className={`mdl-tabs__tab ${styles.tab} ${props.activeTab === 'flagged' ? styles.active : ''}`}
        >
          {lang.t('modqueue.flagged')}
        </a>
      </div>
      <div className={`mdl-tabs__panel is-active ${styles.listContainer}`} id='all'>
        {
          props.activeTab === 'all' &&
          <div>
            <ModerationList
              suspectWords={props.settings.settings.wordlist.suspect}
              isActive={props.activeTab === 'all'}
              singleView={props.singleView}
              commentIds={[...props.premodIds, ...props.flaggedIds]}
              comments={props.comments.byId}
              users={props.users.byId}
              actionIds={props.userActionIds}
              actions={props.actions.byId}
              userStatusUpdate={props.userStatusUpdate}
              suspendUser={props.suspendUser}
              updateCommentStatus={props.updateStatus}
              onClickShowBanDialog={props.showBanUserDialog}
              modActions={['reject', 'approve', 'ban']}
              loading={props.comments.loading}/>
            <BanUserDialog
              open={props.comments.showBanUserDialog}
              handleClose={props.hideBanUserDialog}
              onClickBanUser={props.userStatusUpdate}
              user={props.comments.banUser}
            />
          </div>
        }
      </div>
      {
        props.enablePremodTab
        ? <div className={`mdl-tabs__panel is-active ${styles.listContainer}`} id='premod'>
          {
            props.activeTab === 'premod' &&
            <div>
              <ModerationList
                suspectWords={props.settings.settings.wordlist.suspect}
                isActive={props.activeTab === 'premod'}
                singleView={props.singleView}
                commentIds={props.premodIds}
                comments={props.comments.byId}
                users={props.users.byId}
                actions={props.actions.byId}
                userStatusUpdate={props.userStatusUpdate}
                suspendUser={props.suspendUser}
                updateCommentStatus={props.updateStatus}
                onClickShowBanDialog={props.showBanUserDialog}
                modActions={['reject', 'approve', 'ban']}
                loading={props.comments.loading}/>
              <BanUserDialog
                open={props.comments.showBanUserDialog}
                handleClose={props.hideBanUserDialog}
                onClickBanUser={props.userStatusUpdate}
                user={props.comments.banUser}
              />
            </div>
          }
        </div>
        : null
      }

      <div className={`mdl-tabs__panel ${styles.listContainer}`} id='account'>
        {
          props.activeTab === 'account' &&
          <div>
            <ModerationList
              suspectWords={props.settings.settings.wordlist.suspect}
              isActive={props.activeTab === 'account'}
              singleView={props.singleView}
              users={props.users.byId}
              actionIds={props.userActionIds}
              actions={props.actions.byId}
              userStatusUpdate={props.userStatusUpdate}
              suspendUser={props.suspendUser}
              updateCommentStatus={props.updateStatus}
              onClickShowBanDialog={props.showBanUserDialog}
              modActions={['reject', 'approve', 'ban']}
              loading={props.comments.loading}/>
            <BanUserDialog
              open={props.comments.showBanUserDialog}
              handleClose={props.hideBanUserDialog}
              onClickBanUser={props.userStatusUpdate}
              user={props.comments.banUser}
            />
          </div>
        }
      </div>
      <div className={`mdl-tabs__panel ${styles.listContainer}`} id='flagged'>
      {
        props.activeTab === 'flagged' &&
        <div>
          <ModerationList
            suspectWords={props.settings.settings.wordlist.suspect}
            isActive={props.activeTab === 'flagged'}
            singleView={props.singleView}
            commentIds={props.flaggedIds}
            userStatusUpdate={props.userStatusUpdate}
            suspendUser={props.suspendUser}
            comments={props.comments.byId}
            users={props.users.byId}
            updateCommentStatus={props.updateStatus}
            modActions={['reject', 'approve']}
            loading={props.comments.loading}/>
          <BanUserDialog
            open={props.comments.showBanUserDialog}
            handleClose={props.hideBanUserDialog}
            onClickBanUser={props.userStatusUpdate}
            user={props.comments.banUser}
          />
        </div>
        }
       </div>
       <div className={`mdl-tabs__panel ${styles.listContainer}`} id='rejected'>
       {
         props.activeTab === 'rejected' &&
         <div>
           <ModerationList
             suspectWords={props.settings.settings.wordlist.suspect}
             isActive={props.activeTab === 'rejected'}
             singleView={props.singleView}
             commentIds={props.rejectedIds}
             userStatusUpdate={props.userStatusUpdate}
             suspendUser={props.suspendUser}
             comments={props.comments.byId}
             users={props.users.byId}
             updateCommentStatus={props.updateStatus}
             modActions={['approve']}
             loading={props.comments.loading}
           />
           <BanUserDialog
             open={props.comments.showBanUserDialog}
             handleClose={props.hideBanUserDialog}
             onClickBanUser={props.userStatusUpdate}
             user={props.comments.banUser}
           />
         </div>
       }
       </div>

      <ModerationKeysModal open={props.modalOpen} onClose={props.closeModal} />
    </div>
  </div>
);

ModerationQueue.propTypes = {
  enablePremodTab: PropTypes.bool.isRequired
};

export default ModerationQueue;
