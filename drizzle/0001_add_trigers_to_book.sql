-- Custom SQL migration file, put your code below! --

CREATE OR REPLACE FUNCTION update_book_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE books
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM book_reviews
    WHERE book_id = NEW.book_id
  )
  WHERE id = NEW.book_id;

  IF TG_OP = 'DELETE' THEN
    UPDATE books
    SET rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM book_reviews
      WHERE book_id = OLD.book_id
    )
    WHERE id = OLD.book_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER book_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON book_reviews
FOR EACH ROW EXECUTE FUNCTION update_book_rating();

-- Функция для обновления рейтинга серии
CREATE OR REPLACE FUNCTION update_series_rating() RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем рейтинг в таблице book_series
  UPDATE book_series
  SET rating = (
    SELECT COALESCE(AVG(value), 0)
    FROM series_ratings
    WHERE series_id = NEW.series_id
  )
  WHERE id = NEW.series_id;

  -- Если запись удаляется, обновляем рейтинг для старого book_series_id
  IF TG_OP = 'DELETE' THEN
    UPDATE book_series
    SET rating = (
      SELECT COALESCE(AVG(value), 0)
      FROM series_ratings
      WHERE series_id = OLD.book_series_id
    )
    WHERE id = OLD.series_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Триггер для вызова функции после операций INSERT, UPDATE, DELETE
CREATE TRIGGER series_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON series_ratings
FOR EACH ROW EXECUTE FUNCTION update_series_rating();