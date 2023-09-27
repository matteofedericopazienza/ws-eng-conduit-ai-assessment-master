import { createSelector } from '@ngrx/store';
import { articleFeature } from './article.reducer';

export const { selectArticleState, selectComments, selectData, selectLoaded, selectLoading } = articleFeature;
export const getAuthorUsername = createSelector(selectData, (data) => data.author.username);
export const getAdditionalAuthors = createSelector(selectData, (data) => data.additionalAuthors.map);
export const getLocked = createSelector(selectData, (data) => data.isLocked);

export const articleQuery = {
  selectArticleState,
  selectComments,
  selectData,
  selectLoaded,
  selectLoading,
  getAuthorUsername,
  getAdditionalAuthors,
  getLocked,
};
