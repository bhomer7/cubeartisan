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
import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Spinner } from 'reactstrap';

import CardPropType from '@cubeartisan/client/proptypes/CardPropType.js';
import DraftSeatPropType from '@cubeartisan/client/proptypes/DraftSeatPropType.js';
import DeckPropType from '@cubeartisan/client/proptypes/DeckPropType.js';
import CommentsSection from '@cubeartisan/client/components/CommentsSection.js';
import FoilCardImage from '@cubeartisan/client/components/FoilCardImage.js';
import Markdown from '@cubeartisan/client/components/markdown/Markdown.js';
import { makeSubtitle } from '@cubeartisan/client/utils/Card.js';
import Suspense from '@cubeartisan/client/components/wrappers/Suspense.js';

const DecksPickBreakdown = lazy(async () => import('@cubeartisan/client/components/DecksPickBreakdown.js'));
const DraftbotBreakdown = lazy(async () => import('@cubeartisan/client/components/DraftbotBreakdown.js'));

const DeckStacksStatic = ({ piles, cards }) => (
  <CardBody className="pt-0 border-bottom">
    {piles.map((row, index) => (
      <Row key={/* eslint-disable-line react/no-array-index-key */ index} className="row-low-padding">
        {row.map((column, index2) => (
          <Col
            key={/* eslint-disable-line react/no-array-index-key */ index2}
            className="card-stack col-md-1-5 col-lg-1-5 col-xl-1-5 col-low-padding"
            xs={3}
          >
            <div className="w-100 text-center mb-1">
              <b>{column.length > 0 ? column.length : ''}</b>
            </div>
            <div className="stack">
              {column.map((cardIndex, index3) => {
                const card = cards[cardIndex];
                return (
                  <div className="stacked" key={/* eslint-disable-line react/no-array-index-key */ index3}>
                    <a href={card.cardID ? `/card/${card.cardID}` : null}>
                      <FoilCardImage card={card} tags={[]} autocard />
                    </a>
                  </div>
                );
              })}
            </div>
          </Col>
        ))}
      </Row>
    ))}
  </CardBody>
);

DeckStacksStatic.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({ cardID: PropTypes.string })).isRequired,
  piles: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired))).isRequired,
};

const DeckCard = ({ seat, deck, seatIndex, draft, view }) => {
  const [username] = deck.seats[seatIndex].username.split(':');
  const draftSeatIndex = draft.seats.findIndex(({ name }) => name === username);
  console.log('draftSeatIndex', draftSeatIndex);
  const stackedDeck = seat.deck.slice();
  const stackedSideboard = seat.sideboard.slice();
  let sbCount = 0;
  for (const col of stackedSideboard[0]) {
    sbCount += col.length;
  }
  if (sbCount <= 0) {
    stackedSideboard.splice(0, stackedSideboard.length);
  }
  // Cut off empty columns at the end.
  let lastFull;
  for (const row of stackedDeck) {
    for (lastFull = row.length - 1; lastFull >= 0; lastFull--) {
      if (row[lastFull] && row[lastFull].length > 0) {
        break;
      }
    }
    const startCut = lastFull + 1;
    row.splice(startCut, row.length - startCut);
  }

  let lastFullSB;
  for (const row of stackedSideboard) {
    for (lastFullSB = row.length - 1; lastFullSB >= 0; lastFullSB--) {
      if (row[lastFullSB] && row[lastFullSB].length > 0) {
        break;
      }
    }
    const startCut = lastFullSB + 1;
    row.splice(startCut, row.length - startCut);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-0 d-flex flex-row align-items-end">
          <h4 className="mb-0 mr-auto">{seat.name}</h4>
          {!seat.bot && (
            <h6 className="mb-0 font-weight-normal d-none d-sm-block">
              Drafted by {seat.userid ? <a href={`/user/${seat.userid}`}>{seat.username}</a> : 'Anonymous'}
            </h6>
          )}
        </CardTitle>
      </CardHeader>
      <Suspense fallback={<Spinner />}>
        {view === 'picks' && (
          <CardBody>
            {draft ? (
              <DecksPickBreakdown deck={deck} seatIndex={draftSeatIndex} draft={draft} />
            ) : (
              <h4>This deck does not have a related draft log.</h4>
            )}
          </CardBody>
        )}
        {view === 'deck' && (
          <>
            <Row className="mt-3">
              <Col>
                <DeckStacksStatic
                  piles={stackedDeck}
                  cards={deck.cards}
                  title="Deck"
                  subtitle={makeSubtitle(
                    seat.deck
                      .flat()
                      .flat()
                      .map((cardIndex) => deck.cards[cardIndex]),
                  )}
                />
              </Col>
            </Row>
            {stackedSideboard && stackedSideboard.length > 0 && (
              <Row>
                <Col>
                  <CardBody className="border-bottom">
                    <h4>Sideboard</h4>
                  </CardBody>
                  <DeckStacksStatic piles={stackedSideboard} cards={deck.cards} title="Sideboard" />
                </Col>
              </Row>
            )}
          </>
        )}
        {view === 'draftbot' && (
          <CardBody>
            {draft ? (
              <DraftbotBreakdown deck={deck} seatIndex={draftSeatIndex} draft={draft} />
            ) : (
              <h4>This deck does not have a related draft log.</h4>
            )}
          </CardBody>
        )}
      </Suspense>
      <CardBody>
        <Markdown markdown={seat.description} />
      </CardBody>
      <div className="border-top">
        <CommentsSection parentType="deck" parent={deck._id} collapse={false} />
      </div>
    </Card>
  );
};

DeckCard.propTypes = {
  seat: DraftSeatPropType.isRequired,
  view: PropTypes.string,
  draft: PropTypes.shape({
    cards: PropTypes.arrayOf(CardPropType).isRequired,
    seats: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired).isRequired,
  }).isRequired,
  deck: DeckPropType.isRequired,
  seatIndex: PropTypes.string.isRequired,
};

DeckCard.defaultProps = {
  view: 'deck',
};

export default DeckCard;
