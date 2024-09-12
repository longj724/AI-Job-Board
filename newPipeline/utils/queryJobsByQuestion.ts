// External Dependencies

// Relative Dependencies
// import { supabaseClient } from './supabaseClient';
import { openAI } from './openAIClient';

export const queryJobsByQuestion = async (): Promise<void> => {
  // const supabase = supabaseClient(); // Adjust according to actual supabaseClient export
  const question = 'Junior software engineering jobs';

  const embeddingResponse = await openAI.embeddings.create({
    model: 'text-embedding-ada-002',
    input: question.replaceAll('\n', ' '),
  });

  const [{ embedding }] = embeddingResponse.data;

  // const { error: matchError, data: matchingApplications } = await supabase
  //   .rpc('application_similarity_search_no_join', {
  //     // Can't pass in embedding type - https://github.com/supabase/postgres-meta/issues/578
  //     query_embedding: JSON.stringify(embedding),
  //     similarity_threshold: 0.75,
  //     match_count: 50,
  //   })
  //   .select('*');
  // console.log('matchingApplications', matchingApplications);
};

const main = async (): Promise<void> => {
  await queryJobsByQuestion();
};

main();
