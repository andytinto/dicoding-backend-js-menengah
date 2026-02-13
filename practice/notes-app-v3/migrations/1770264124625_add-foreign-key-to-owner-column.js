/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // membuat user baru untuk owner lama notes yang belum memiliki owner.
  pgm.sql("INSERT INTO users(id, username, password, fullname, created_at, updated_at) VALUES ('old_notes', 'old_notes', 'old_notes', 'old notes', NOW(), NOW())");

  // mengubah nilai owner pada note yang owner-nya bernilai NULL menjadi 'old_notes'
  pgm.sql('UPDATE notes SET owner = \'old_notes\' WHERE owner IS NULL');

  // memberikan constraint foreign key pada owner terhadap kolom id dari table users
  pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // menghapus cosntroint fk_notes.owner_users.id pada table notes
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  // mengubah nilai  owner old_notes pada note menjadi NULL
  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");

  // menghapus user baru.
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
