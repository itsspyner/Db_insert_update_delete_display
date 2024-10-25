const pdf = require('pdfkit');

function resume(jsonData){
const parsedData = jsonData;
const doc = new pdf();

parsedData.personal_info.forEach((personal_info) => {
    doc.font('Helvetica-Bold').fontSize(18).text(personal_info.name, { align: 'center' });
    doc.text(personal_info.address, { align: 'center' });
    doc.text(personal_info.phone + ' | ' + personal_info.email, { align: 'center' });
    doc.text('\n');
});

doc.font('Helvetica-Bold').fontSize(14).text(parsedData.brief_description, { align: 'center' });

doc.font('Helvetica-Bold').fontSize(16).text('Professional Experience\n');

parsedData.experiences.forEach((experience) => {
    doc.font('Helvetica-Bold').fontSize(14).text(experience.company + ' | ' + experience.position + ' | ' + experience.work_year);
    doc.text('Company_logo: ' + experience.company_logo);
    doc.text('Duties:' + experience.duties);
    doc.text('\n');
});

doc.font('Helvetica-Bold').fontSize(16).text('\nEducation\n');
parsedData.education.forEach((education) => {
    doc.font('Helvetica-Bold').fontSize(14).text(education.school_name + ' | ' + education.year);
    doc.text('Level: ' + education.level);
    doc.text('Title:' + education.title);
    doc.text('\n');
});

doc.font('Helvetica-Bold').fontSize(16).text('Skills:\n');
doc.font('Helvetica-Bold').fontSize(14).text(parsedData.skills.join('   '));
doc.end();

return doc;
}

module.exports = {resume};