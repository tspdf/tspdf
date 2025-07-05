import Layout from '@theme/Layout';
import { PDFViewer } from '@tspdf/react-pdf';

import styles from './demo.module.css';

function PDFDemo() {
  return (
    <div className={styles.pdfContainer}>
      <PDFViewer file='https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf' />
    </div>
  );
}

export default function Demo() {
  return (
    <Layout title='TSPDF Demo' description='TSPDF React Component Demo'>
      <main>
        <section className={styles.statusSection}>
          <h2 className={styles.sectionTitle}>
            This demo page displays the current status of the project:
          </h2>

          <div className={styles.statusCards}>
            <div className={`${styles.statusCard} ${styles.warning}`}>
              <h3 className={`${styles.statusCardTitle} ${styles.warning}`}>
                In Development
              </h3>
              <p className={styles.statusCardContent}>
                This project is actively under development.
              </p>
            </div>

            <div className={`${styles.statusCard} ${styles.danger}`}>
              <h3 className={`${styles.statusCardTitle} ${styles.danger}`}>
                Important Notice
              </h3>
              <p className={styles.statusCardContent}>
                Please do not use this library in production environments.
                Features and APIs may change significantly. If you need{' '}
                something production-ready, consider using{' '}
                <a
                  href='https://mozilla.github.io/pdf.js/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  PDF.js
                </a>{' '}
                directly or{' '}
                <a
                  href='https://github.com/wojtekmaj/react-pdf'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  react-pdf
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section className={styles.demoSection}>
          <PDFDemo />
        </section>
      </main>
    </Layout>
  );
}
