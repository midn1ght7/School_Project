// TODO:
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import styled from "styled-components";
import Button from "./Button";
import Title from "./Title";

const options = [
  { value: "0", label: "100" },
  { value: "1", label: "200" },
  { value: "2", label: "300" },
  { value: "3", label: "400" },
];
const CostCalculator = () => {
  const [ordered, setOrdered] = useState(0);
  const [sold, setSold] = useState(0);
  const [profit, setProfit] = useState(0);
  const [lossMatrix, setlossMatrix] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  useEffect(() => {
    setlossMatrix(getLoss(cloneArray(matrix), getMaxFromRow(transponeMatrix)));
  }, []);

  const onSubmit = () => {
    setProfit(matrix[ordered][sold]);
    setlossMatrix(getLoss(cloneArray(matrix), getMaxFromRow(transponeMatrix)));
  };
  interface Form {
    firstDay: number;
    secondDay: number;
  }

  const { values, handleChange } = useFormik<Form>({
    initialValues: {
      firstDay: 14,
      secondDay: 7,
    },
    onSubmit,
  });
  const matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const demand = [100, 200, 300, 400];
  const supply = [100, 200, 300, 400];
  const buyPrices = [12, 10, 9, 9];

  for (let i = 0; i < matrix.length; i += 1) {
    const value = matrix[i];
    for (let j = 0; j < matrix.length; j += 1) {
      if (j > i) {
        value[j] = value[i];
      } else {
        value[j] =
          -supply[i] * buyPrices[i] +
          (demand[j] * values.firstDay +
            (supply[i] - demand[j]) * values.secondDay);
      }
    }
  }

  const cloneArray = (array: number[][]): number[][] => {
    const loss = [[0]];
    for (let i = 0; i < array.length; i += 1) loss[i] = [...array[i]];
    return loss;
  };

  const getTransponderMatrix = (array: number[][]) =>
    array[0].map((_, i) => array.map((x: { [x: number]: number }) => x[i]));

  const transponeMatrix = getTransponderMatrix(matrix);

  console.log(transponeMatrix);

  // get max from each row
  const getMaxFromRow = (array: number[][]) => {
    const max = [];
    for (let i = 0; i < array.length; i += 1) {
      let maxValue = array[i][0];
      for (let j = 1; j < array[i].length; j += 1) {
        if (array[i][j] > maxValue) maxValue = array[i][j];
      }
      max.push(maxValue);
    }
    return max;
  };
  // get min from each row
  const getMinFromRow = (array: number[][]) => {
    const min = [];
    for (let i = 0; i < array.length; i += 1) {
      let minValue = array[i][0];
      for (let j = 1; j < array[i].length; j += 1) {
        if (array[i][j] < minValue) minValue = array[i][j];
      }
      min.push(minValue);
    }
    return min;
  };

  const getLoss = (loss: number[][], max: number[]): number[][] => {
    for (let i = 0; i < loss.length; i += 1) {
      const value = loss[i];
      for (let j = 0; j < loss.length; j += 1) {
        value[j] = max[j] - value[j];
      }
    }
    console.log(loss);
    return loss;
  };

  const handleOrderedChange = (e: any) => {
    setOrdered(parseInt(e.value, 10));
  };

  const handleSoldChange = (e: any) => {
    setSold(parseInt(e.value, 10));
  };


  const maxValue = Math.max(...getMaxFromRow(matrix));
  console.log("hurwicza", maxValue);

  // walda
  const waldValue = Math.max(...getMinFromRow(matrix));
  console.log(waldValue);

  // savage
  const savageValue = Math.min(...getMaxFromRow(lossMatrix));
  console.log("savage", savageValue);

  // prawdopodobienstwo 0.2 0.1 0.5 0.2

  const sumFromRow = (array: number[][]) => {
    const sum = [];
    for (let i = 0; i < array.length; i += 1) {
      let sumValue = 0;
      for (let j = 0; j < array[i].length; j += 1) {
        if (j === 0) {
          sumValue += array[i][j] * 0.2;
        }
        if (j === 1) {
          sumValue += array[i][j] * 0.1;
        }
        if (j === 2) {
          sumValue += array[i][j] * 0.5;
        }
        if (j === 3) {
          sumValue += array[i][j] * 0.2;
        }
      }
      sum.push(sumValue);
    }
    return sum;
  };

  const owi = sumFromRow(cloneArray(matrix));
  console.log("owi", Math.max(...owi));

  // OWDI
  // maksymalne wartości z kadego rzędu razy prawdopodobieństwo
  // suma z tego

  const maxValuesArr = getMaxFromRow(matrix);

  const owdiValue =
    maxValuesArr[0] * 0.2 +
    maxValuesArr[1] * 0.1 +
    maxValuesArr[2] * 0.5 +
    maxValuesArr[3] * 0.2;

  console.log("owdi", owdiValue);

  return (
    <Wrapper>
      <Title>Wypłaty 💰</Title>
      <Row>
        <h3>Cena pierwszego dnia: </h3>
        <input onChange={handleChange("firstDay")} value={values.firstDay} />
      </Row>
      <Row>
        <h3>Cena drugiego dnia: </h3>
        <input onChange={handleChange("secondDay")} value={values.secondDay} />
      </Row>
      <Row>
        <h3>Popyt na róże🌹: </h3>
        <Select options={options} onChange={handleSoldChange} />
      </Row>
      <Row>
        <h3>Ilość zamówionych 🚚: </h3>
        <Select options={options} onChange={handleOrderedChange} />
      </Row>
      <Button onClick={onSubmit} name="Oblicz" />
      <Title>Zysk z róz: {profit}</Title>
      <Title>Tabela wypłat</Title>
      <Table>
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>100</th>
              <th>200</th>
              <th>300</th>
              <th>400</th>
            </tr>
          </thead>
          {matrix.map((row, i) => (
            <tr key={i}>
              <th scope="row">{i + 1}00</th>
              {row.map((value, j) => (
                <td key={j}>{value}</td>
              ))}
            </tr>
          ))}
        </table>
      </Table>
      <Title>Tabela wypłat</Title>
      <Table>
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>100</th>
              <th>200</th>
              <th>300</th>
              <th>400</th>
            </tr>
          </thead>
          {lossMatrix.map((row, i) => (
            <tr key={i}>
              <th scope="row">{i + 1}00</th>
              {row.map((value, j) => (
                <td key={j}>{value}</td>
              ))}
            </tr>
          ))}
        </table>
      </Table>
    </Wrapper>
  );
};

export default CostCalculator;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Table = styled.tr`
  padding: 4rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      th {
        background-color: ${({ theme }) => theme.palette.lightGrey};
      }
      :first-child {
        th {
          border-bottom: 1px solid black !important;
        }
      }
      :last-child {
        td,
        th {
          border-bottom: 0px;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 2rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :first-child {
        th {
          border: 0;
        }
      }
      :last-child {
        border-right: 0;
      }
    }
  }
`;
