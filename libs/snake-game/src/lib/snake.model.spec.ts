import { Snake } from './snake.model';
import { Direction } from './constant';

const MOCK_BODY = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 1, y: 1 },
];

describe('Test snake: move', () => {
  const snake = new Snake(
    { width: 10, height: 10 },
    Direction.Down,
    MOCK_BODY.slice(0, 3)
  );

  it('Move down', () => {
    const target = { x: 0, y: 3 };
    snake.move();
    const pos = snake.headPosition;
    expect(pos.x === target.x && pos.y === target.y).toBe(true);
  });
});

describe('Test snake: eat', () => {
  const snake = new Snake(
    { width: 10, height: 10 },
    Direction.Down,
    MOCK_BODY.slice(0, 3)
  );

  it('Eat', () => {
    const target = { x: 0, y: 3 };
    snake.eat(1);
    const pos = snake.headPosition;
    expect(
      pos.x === target.x && pos.y === target.y && snake.body.length === 4
    ).toBe(true);
  });
});

describe('Test snake: bite', () => {
  let snake: Snake;
  beforeEach(() => {
    snake = new Snake({ width: 10, height: 10 }, Direction.Up, [...MOCK_BODY]);
  });

  it(`Turn left should bite itself`, () => {
    snake.changeDirection(Direction.Left);
    snake.move();
    expect(snake.isBitten).toBe(true);
  });

  it(`Turn right should not bite itself`, () => {
    snake.changeDirection(Direction.Right);
    snake.move();
    expect(snake.isBitten).toBe(false);
  });

  it(`Turn up should not bite itself`, () => {
    snake.changeDirection(Direction.Up);
    snake.move();

    expect(snake.isBitten).toBe(false);
  });

  it(`Turn down should not bite itself`, () => {
    snake.changeDirection(Direction.Down);
    snake.move();
    expect(snake.isBitten).toBe(false);
  });
});

describe('Test snake: hit the boundary', () => {
  let snake: Snake;
  beforeEach(() => {
    snake = new Snake(
      { width: 10, height: 10 },
      Direction.Down,
      MOCK_BODY.slice(0, 3)
    );
  });

  it(`Turn left should hit the boundary`, () => {
    snake.changeDirection(Direction.Left);
    snake.move();
    expect(snake.isHitTheWall).toBe(true);
  });

  it(`Turn right should not hit the boundary`, () => {
    snake.changeDirection(Direction.Right);
    snake.move();
    expect(snake.isHitTheWall).toBe(false);
  });

  it(`Turn up should not hit the boundary`, () => {
    snake.changeDirection(Direction.Up);
    snake.move();
    expect(snake.isHitTheWall).toBe(false);
  });

  it(`Turn bottom should not hit the boundary`, () => {
    snake.changeDirection(Direction.Down);
    snake.move();
    expect(snake.isHitTheWall).toBe(false);
  });
});
