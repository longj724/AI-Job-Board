const { supabaseClient } = require('./supabaseClient');
const openAI = require('./openAIClient');

module.exports.queryJobsByQuestion = async () => {
  const supabase = supabaseClient();
  const question = 'I am looking for an internship';

  const embeddingResponse = await openAI.embeddings.create({
    model: 'text-embedding-ada-002',
    input: question.replaceAll('\n', ' '),
  });

  const [{ embedding }] = embeddingResponse.data;

  console.log('embedding is', embedding);

  const { error: matchError, data: matchingApplications } = await supabase
    .rpc('application_similarity_search', {
      query_embedding: embedding,
      similarity_threshold: 0.1,
      match_count: 10,
    })
    .select('*');

  console.log('matchingApplications', matchingApplications);
  console.log('matchingError', matchError);
};

const main = () => {
  this.queryJobsByQuestion();
};

main();
