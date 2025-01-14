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
import React, { forwardRef, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import CardPropType from '@cubeartisan/client/proptypes/CardPropType.js';

import DisplayContext from '@cubeartisan/client/components/contexts/DisplayContext.js';
import ImageFallback from '@cubeartisan/client/components/ImageFallback.js';
import withAutocard from '@cubeartisan/client/components/hoc/WithAutocard.js';
import { cardName } from '@cubeartisan/client/utils/Card.js';

const ImageAutocard = withAutocard(ImageFallback);

const CardImage = forwardRef(({ card, autocard, className, width, height, ...props }, ref) => {
  const { showCustomImages } = useContext(DisplayContext);
  const imageSrc = (showCustomImages && card.imgUrl) || card.details.image_normal;
  const Tag = autocard ? ImageAutocard : ImageFallback;
  const fallbackRef = useRef();

  return (
    <Tag
      card={autocard ? card : undefined}
      src={imageSrc}
      fallbackSrc="/content/default_card.png"
      alt={cardName(card)}
      width={width || '100%'}
      height={height || 'auto'}
      className={className ? `${className} card-border` : 'card-border'}
      ref={ref ?? fallbackRef}
      {...props}
    />
  );
});
CardImage.propTypes = {
  card: CardPropType.isRequired,
  autocard: PropTypes.bool,
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};
CardImage.defaultProps = {
  autocard: false,
  className: null,
  width: null,
  height: null,
};
CardImage.displayName = 'CardImage';

export default CardImage;
