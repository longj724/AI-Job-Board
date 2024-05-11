// External Dependencies
import fs from 'fs';
import cheerio from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

// Relative Dependencies

export const getJobInfoFromLeverApplications = async (): Promise<void> => {
  let startTime = Date.now();
  const files = fs.readdirSync('./activeData/applications/lever');

  for (const file of files) {
    const content = fs.readFileSync(
      `./activeData/applications/lever/${file}`,
      'utf-8'
    );

    const $ = cheerio.load(content);

    const companyName = file.split('-')[0];
    const jobTitle = $('.posting-headline h2').text();
    const location = $('.location').text();

    const department = $('.department').text().trim();
    const commitment = $('.commitment').text();
    const workplaceType = $('.workplaceTypes').text().trim();

    console.log('companyName is', companyName);
    console.log('jobTitle is', jobTitle);
    console.log('location is', location);
    console.log('department is', department);
    console.log('commitment is', commitment);
    console.log('workplaceType is', workplaceType);

    // Temporary check to see if company has already been embedded
    // Will usually be adding new applications and won't want/need to do this
    // const { data: existingCompanyData } = await supabase
    //   .from('Applications')
    //   .select('id')
    //   .eq('company', companyName);

    // if (!existingCompanyData || existingCompanyData.length === 0) {
    //   // console.log('in loop');
    //   console.log(companyName);
    //   console.log(jobTitle);
    //   console.log(location);

    //   const department = $('.department').text().trim();
    //   const commitment = $('.commitment').text();
    //   const workplaceType = $('.workplaceTypes').text().trim();

    //   const applicationDivs = $('.section-wrapper.page-full-width > div');

    //   let applicationText = '';
    //   let applicationChunks: string[] = [];
    //   applicationDivs.each(function (this: any) {
    //     const text = $(this).text().trim();
    //     applicationText += text;
    //     if (text.split(' ').length > 7) {
    //       applicationChunks.push(text);
    //     }
    //   });

    //   if (
    //     companyName !== '' &&
    //     jobTitle !== '' &&
    //     applicationChunks.length > 0
    //   ) {
    //     const { data: applicationData, error: appError } = await supabase
    //       .from('Applications')
    //       .insert({
    //         company: companyName,
    //         title: jobTitle.trim(),
    //         location: location,
    //         content: applicationText,
    //       })
    //       .select('*');

    //     if (applicationData !== null) {
    //       for (const chunk of applicationChunks) {
    //         if (numEmbeddingCalls >= 3000) {
    //           const now = Date.now();
    //           const timePassed = now - startTime;
    //           if (timePassed < 60000) {
    //             console.log(
    //               `Limit reached. Waiting for ${60000 - timePassed}ms.`
    //             );
    //             await new Promise((resolve) =>
    //               setTimeout(resolve, 60000 - timePassed)
    //             );
    //           }
    //           numEmbeddingCalls = 0;
    //           startTime = Date.now();
    //         }

    //         const embeddingResponse = await openAI.embeddings.create({
    //           model: 'text-embedding-ada-002',
    //           input: chunk,
    //         });
    //         numEmbeddingCalls += 1;

    //         const [responseData] = embeddingResponse.data;
    //         const { data, error } = await supabase
    //           .from('Application_Embeddings')
    //           .insert({
    //             application_id: applicationData[0].id,
    //             embedding: JSON.stringify(responseData.embedding),
    //             token_count: embeddingResponse.usage.total_tokens,
    //             content: applicationText,
    //           })
    //           .select('*');
    //         console.log('chunk is', chunk);
    //         console.log('**********');
    //       }
    //     }
    //   }
    // }
  }
};

const main = (): void => {
  getJobInfoFromLeverApplications();
};

main();
