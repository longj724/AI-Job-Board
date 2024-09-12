// External Dependencies
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const postings = pgTable('postings', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  companyId: text('company_id')
    .notNull()
    .references(() => company.id, { onDelete: 'cascade' }),
  jobTitle: text('job_title').notNull(),
  location: text('location'),
  workplaceType: varchar('workplace_type', { length: 50 }),
});

export const postingRelations = relations(postings, ({ one }) => ({
  company: one(company, {
    fields: [postings.companyId],
    references: [company.id],
  }),
}));

export const company = pgTable('company', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  website: text('website'),
  ipoStatus: text('ipo_status'),
  headquarters: text('headquarters'),
  fundingType: text('funding_type'),
  employeeCount: integer('employee_count'),
});
