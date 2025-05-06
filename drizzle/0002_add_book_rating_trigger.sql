-- Custom SQL migration file, put your code below! --

CREATE OR REPLACE FUNCTION update_book_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE books
  SET rating = (
    SELECT COALESCE(AVG(value), 0)
    FROM book_ratings
    WHERE book_id = NEW.book_id
  )
  WHERE id = NEW.book_id;

  IF TG_OP = 'DELETE' THEN
    UPDATE books
    SET rating = (
      SELECT COALESCE(AVG(value), 0)
      FROM book_ratings
      WHERE book_id = OLD.book_id
    )
    WHERE id = OLD.book_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER book_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON book_ratings
FOR EACH ROW EXECUTE FUNCTION update_book_rating();

