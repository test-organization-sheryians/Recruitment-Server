import { graph } from "../utils/langgraph.js";

const pdfParse = async (buffer) => {
    const { default: pdf } = await import('pdf-parse/lib/pdf-parse.js');
    return pdf(buffer);
};

export async function generateQuestion(req, res) {
    try {
        let profileData;

        if (req.file) {
            if (req.file.mimetype !== 'application/pdf') {
                return res.status(400).json({ 
                    success: false,
                    error: "File must be a PDF" 
                });
            }

            const pdfBuffer = req.file.buffer;
            const data = await pdfParse(pdfBuffer);
            const extractedText = data.text.replace(/\s+/g, ' ').trim();
            
            profileData = {
                resumeText: extractedText,
                source: 'pdf',
                metadata: {
                    pageCount: data.numpages,
                    pdfInfo: data.info
                }
            };
        } else if (req.body) {
            profileData = req.body;
        } else {
            return res.status(400).json({ 
                success: false,
                error: "Either provide a PDF file or JSON profile data" 
            });
        }

        const result = await graph.invoke({
            profile: profileData
        }, { startNode: "QuestionGenerator" });
        const response = {
            success: true,
            questions: result.questionsData || result
        };

        if (req.file) {
            response.source = 'pdf';
            response.text = profileData.resumeText;
            response.pageCount = profileData.metadata.pageCount;
        }

        res.json(response);
        
    } catch (err) {
        console.error('Error in generateQuestion:', err);
        
        if (err.message.includes('PDF')) {
            return res.status(400).json({ 
                success: false,
                error: "Invalid PDF file" 
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: "Error generating questions",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

export async function evaluateAnswers(req, res) {
    try {
        const { questions, answers } = req.body;
        const result = await graph.invoke({
            questions,
            answers
        }, { startNode: "AnswerEvaluator"})

        res.json({
            evaluation: result.evaluationData,
            total: result.total
        })
    } catch (err) {
        res.status(500).json({ error: "Error evaluating answers" })
    }
}