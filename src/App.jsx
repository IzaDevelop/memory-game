import React, { useEffect, useState, useRef } from "react";
import Card from "./components/card";

export default function () {
    const CardsArray = [
        {
            number: "1",
            name: 'Card 1',
            image: 'https://www.dicaspraticas.com.br/wp-content/uploads/2020/04/desenho-de-pokemon-para-colorir-16.jpg'
        },
        {
            number: "2",
            name: 'Card 2',
            image: 'https://www.pintarcolorir.com.br/wp-content/uploads/2015/04/Desenhos-para-colorir-Charizard-01.png'
        },
        {
            number: "3",
            name: 'Card 3',
            image: 'https://upload.wikimedia.org/wikipedia/sh/thumb/4/43/Bulbasaur.png/1200px-Bulbasaur.png'
        },
        {
            number: "4",
            name: 'Card 4',
            image: 'https://assets.stickpng.com/images/580b57fcd9996e24bc43c32a.png'
        },
        {
            number: "5",
            name: 'Card 5',
            image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png'
        },
        {
            number: "6",
            name: 'Card 6',
            image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/054.png'
        }
    ]

    function shuffleCards(array) {
        const length = array.length;

        for (let i = length; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * i);
            const currentIndex = i - 1;
            const temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temp;
        }

        return array
    }

    const [move, setMove] = useState(0);
    const [cards, setCards] = useState(() => shuffleCards(CardsArray.concat(CardsArray)))
    const [openCards, setOpenCards] = useState([]);
    const [clearedCards, setClearedCards] = useState({});
    const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const timeout = useRef(null);

    const disable = () => {
        setShouldDisableAllCards(true);
    };

    const enable = () => {
        setShouldDisableAllCards(false);
    };

    const checkCompletion = () => {
        if (Object.keys(clearedCards).length === CardsArray.length) {
            setShowModal(true)
        }
    };

    const evaluate = () => {
        const [first, second] = openCards;

        enable();

        if (cards[first].number === cards[second].number) {
            setClearedCards((prev) => ({ ...prev, [cards[first].number]: true }));
            setOpenCards([]);
            return;
        }

        timeout.current = setTimeout(() => {
            setOpenCards([]);
        }, 500);
    };

    const handleCardClick = (index) => {
        if (openCards.length === 1) {
            setOpenCards((prev) => [...prev, index]);
            setMove((move) => move + 1);
            disable();
        } else {
            clearTimeout(timeout.current);
            setOpenCards([index]);
        }
    };

    useEffect(() => {
        let timeout = null;
        if (openCards.length === 2) {
            setTimeout(() => {
                evaluate()
            }, 700)
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [openCards]);

    useEffect(() => {
        checkCompletion();
    }, [clearedCards]);

    const checkIsFlipped = (index) => {
        return openCards.includes(index);
    };

    const checkIsInactive = (row) => {
        return Boolean(clearedCards[row.number]);
    };

    return (
        <article>
            <section className="bg-red-700 grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 h-screen p-4 gap-4">
                {cards.map((row, index) => (
                    <Card
                        key={index}
                        row={row}
                        index={index}
                        onClick={() => handleCardClick(index)}
                        isDisabled={shouldDisableAllCards}
                        isInactive={checkIsInactive(row)}
                        isFlipped={checkIsFlipped(index)}
                    />
                ))}
            </section>

            {showModal && (
            <section className="w-screen h-screen fixed top-0 z-50 bg-neutral-900 bg-opacity-95 flex flex-col justify-center items-center">
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-neutral-100 dark:bg-neutral-700 rounded-lg shadow">
                        <div className="p-6 text-center">
                            <h3 className="mb-5 text-lg font-normal text-neutral-900 dark:text-neutral-200">
                                Parabéns ! <br />
                                Você terminou o jogo com {move} movimentos.
                            </h3>

                            <button type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" onClick={() => window.location.reload()}>
                                Novo Jogo
                            </button> 

                            <button type="button" className="text-neutral-800 bg-neutral-300 hover:bg-neutral-200 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-neutral-800 dark:text-gray-300 dark:hover:text-white dark:hover:bg-neutral-900 dark:focus:ring-neutral-900" onClick={() => window.location.reload()}>Fechar</button>
                        </div>
                    </div>
                </div>
            </section>
            )}
        </article>
    );
}