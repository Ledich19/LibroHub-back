-- Custom SQL migration file, put your code below! --
-- Функция для обновления рейтинга серии
CREATE OR REPLACE FUNCTION update_book_series_rating() RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем рейтинг в таблице book_series
  UPDATE book_series
  SET rating = (
    SELECT COALESCE(AVG(value), 0)
    FROM book_series_ratings
    WHERE book_series_id = NEW.book_series_id
  )
  WHERE id = NEW.book_series_id;

  -- Если запись удаляется, обновляем рейтинг для старого book_series_id
  IF TG_OP = 'DELETE' THEN
    UPDATE book_series
    SET rating = (
      SELECT COALESCE(AVG(value), 0)
      FROM book_series_ratings
      WHERE book_series_id = OLD.book_series_id
    )
    WHERE id = OLD.book_series_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Триггер для вызова функции после операций INSERT, UPDATE, DELETE
CREATE TRIGGER book_series_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON book_series_ratings
FOR EACH ROW EXECUTE FUNCTION update_book_series_rating();