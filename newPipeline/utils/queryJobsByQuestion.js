const { supabaseClient } = require('./supabaseClient');
const openAI = require('./openAIClient');

module.exports.queryJobsByQuestion = async () => {
  const supabase = supabaseClient();
  const question = 'I am looking for software engineering internships';

  const embeddingResponse = await openAI.embeddings.create({
    model: 'text-embedding-ada-002',
    input: question.replaceAll('\n', ' '),
  });

  const [{ embedding }] = embeddingResponse.data;

  const { error: matchError, data: matchingApplications } = await supabase
    .rpc('application_similarity_search_no_join', {
      query_embedding: embedding,
      similarity_threshold: 0.75,
      match_count: 50,
    })
    .select('*');
};

const main = () => {
  this.queryJobsByQuestion();
};

main();
