import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import IdealImage from "@theme/IdealImage";
import img1 from "@site/static/img/workflow-ill.jpg";

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--12")}>
            <div
              className="text--center"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IdealImage img={img1} role="img" className={styles.featureSvg} />
            </div>
            <div className="text--center padding-horiz--md">
              <h3>Easy to Use</h3>
              <p>Workflow That You Can Decode and Debug</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
