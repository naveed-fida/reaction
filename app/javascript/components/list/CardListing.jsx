import React from 'react';
import PropTypes from 'prop-types';

import ListCard from './ListCard';

const sortedCards = (cards) => {
  const copy = cards.slice();
  return copy.sort((a, b) => a.position - b.position);
};

const CardListing = props => (
  <div id="cards-container">
    {
      sortedCards(props.cards).map(card => (
        <ListCard key={card.id} card={card} />
      ))
    }
  </div>
);

CardListing.propTypes = {
  cards: PropTypes.array
};

export default CardListing;
