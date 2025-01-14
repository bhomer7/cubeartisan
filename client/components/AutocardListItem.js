/**
 * This file is part of CubeArtisan.
 *
 * CubeArtisan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CubeArtisan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with CubeArtisan.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Modified from the original version in CubeCobra. See LICENSE.CubeCobra for more information.
 */
import React, { useCallback, useContext, useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import CardPropType from '@cubeartisan/client/proptypes/CardPropType.js';

import CardModalContext from '@cubeartisan/client/components/contexts/CardModalContext.js';
import TagContext from '@cubeartisan/client/components/contexts/TagContext.js';
import withAutocard from '@cubeartisan/client/components/hoc/WithAutocard.js';
import { cardName } from '@cubeartisan/client/utils/Card.js';

const AutocardDiv = withAutocard('li');

const CARD_NAME_FALLBACK = 'Unidentified Card';
const CARD_ID_FALLBACK = 'undefined.js';

/** 2020-11-18 struesdell:
 *  Added noOp callback to allow props to fall through without passing undefined to children.
 */
const noOp = () => undefined;

/** 2020-11-18 struesdell:
 *  Pulled out className constants for maintainability
 */
const styles = {
  root: 'card-list-item list-group-item',
  name: 'card-list-item_name',
  children: 'card-list-item_children',
};

const AutocardListItem = ({ card, noCardModal, inModal, className, children }) => {
  const { cardColorClass } = useContext(TagContext);
  const openCardModal = useContext(CardModalContext);

  /** 2020-11-18 struesdell:
   *  Replaced destructuring with `useMemo` tuple to minimize rerenders
   */
  const [name, cardId] = useMemo(
    () => [cardName(card) ?? CARD_NAME_FALLBACK, card?.details?._id ?? CARD_ID_FALLBACK],
    [card],
  );

  const openCardToolWindow = useCallback(() => {
    window.open(`/card/${cardId}`);
  }, [cardId]);

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      if (event.ctrlKey) {
        openCardToolWindow();
      } else {
        openCardModal(card);
      }
    },
    [card, openCardModal, openCardToolWindow],
  );

  const handleAuxClick = useCallback(
    (event) => {
      if (event.button === 1) {
        event.preventDefault();
        openCardToolWindow();
      }
    },
    [openCardToolWindow],
  );

  /** 2020-11-18 struesdell:
   *  Memoized card color (WUBRG) derivation to minimize rerenders
   *  @note: tag coloring is handled by AutocardDiv automatically.
   */
  const colorClassname = useMemo(() => cardColorClass(card), [card, cardColorClass]);

  return (
    <AutocardDiv
      className={cx(styles.root, colorClassname, className)}
      card={card}
      onAuxClick={noCardModal ? noOp : handleAuxClick}
      onClick={noCardModal ? noOp : handleClick}
      inModal={inModal}
      role="button"
    >
      <span className={styles.name}>{name}</span>
      <span className={styles.children}>{children}</span>
    </AutocardDiv>
  );
};
AutocardListItem.propTypes = {
  card: CardPropType.isRequired,
  noCardModal: PropTypes.bool,
  inModal: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
AutocardListItem.defaultProps = {
  noCardModal: false,
  inModal: false,
  className: '',
  children: undefined,
};

export default AutocardListItem;
