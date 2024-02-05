---
layout: post
tags: [가리사니, 기타]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.


# SAP JCO 시리즈
- [SAP RFC JCO (java - sapjco3.jar)를 이용한 접근방법](/lab?topicId=347)
- [SAP JCO Manager 라이브러리](/lab?topicId=352)

# 준비
우선 SAP 연계정보 제공사를 통해 sapjco3.jar 파일과 리눅스 .so 윈도우 .dll 을 다운받습니다.
(연계정보 제공사를 통하지 않아도 아래에서 받을 수 있습니다.)
[http://maven.mit.edu/nexus/content/repositories/public/com/sap/conn/jco/sapjco3/3.0.14/
라이브러리 파일 (.so, .dll)을 시스템 폴더에 넣습니다.

# 연동 예제
``` java
public static void main(String[] args) throws Exception {
	// SAP 연결
	SapManager sap = SapManager.newSapManagerBinder()
		.set(DestinationDataProvider.JCO_ASHOST, "호스트") // AS 호스트 : 경우에 따라 MS 호스트[JCO_MSHOST] 등도 사용함.
		.set(DestinationDataProvider.JCO_MSSERV, "9999") // MS 포트 [AS, MS는 MS, GW는 JCO_GWSERV]
		.set(DestinationDataProvider.JCO_SYSNR, "01") // 시스템 번호
		.set(DestinationDataProvider.JCO_GROUP, "Group Name") // 그룹
		.set(DestinationDataProvider.JCO_LANG, "KO") // 언어
		.set(DestinationDataProvider.JCO_CLIENT, "100") // 클라이언트 번호
		.set(DestinationDataProvider.JCO_USER, "user") // 계정
		.set(DestinationDataProvider.JCO_PASSWD, "password") // 암호
		.bind();

	// 접속 후 RFC 연결
	SapRfcFunction rfc = sap.getRfcFunction("RFC 함수 이름");

	// IMPORT
	rfc.imports().setValue("AAA", "A"); // AAA
	rfc.imports().setValue("BBB", "B"); // BBB
	rfc.imports().setValue("CCC", "C"); // CCC

	// 실행
	rfc.execute();

	// EXPORT
	System.out.println(rfc.exports().getValue("DDD"));
	System.out.println(rfc.exports().getValue("EEE"));
	System.out.println(rfc.exports().getValue("FFF"));

	// 테이블 조회
	List<ZSPADEPT_NEW> table1 = rfc.getTable("TABLE_NAME", 클래스매핑.class);
	table1.stream().limit(10).forEach(System.out::println); // 10개만 조회
}
```

# 연동 예제 (인자로 테이블 보내기)
사실상 테이블을 넣는걸 제외하곤 위 **연동 예제** 와 동일합니다.
먼저 jcoTable.appendRow(); 를 써서 row를 할당한 후
jcoTable.setValue("컬럼이름", "값"); 으로 하시면됩니다.
다만 타입을 제공자가 준 것과 동일하게 맞춰야합니다.
``` java
public static void main(String[] args) throws Exception {
	// SAP 연결
	SapManager sap = SapManager.newSapManagerBinder()
		.set(DestinationDataProvider.JCO_ASHOST, "호스트") // AS 호스트 : 경우에 따라 MS 호스트[JCO_MSHOST] 등도 사용함.
		.set(DestinationDataProvider.JCO_MSSERV, "9999") // MS 포트 [AS, MS는 MS, GW는 JCO_GWSERV]
		.set(DestinationDataProvider.JCO_SYSNR, "01") // 시스템 번호
		.set(DestinationDataProvider.JCO_GROUP, "Group Name") // 그룹
		.set(DestinationDataProvider.JCO_LANG, "KO") // 언어
		.set(DestinationDataProvider.JCO_CLIENT, "100") // 클라이언트 번호
		.set(DestinationDataProvider.JCO_USER, "user") // 계정
		.set(DestinationDataProvider.JCO_PASSWD, "password") // 암호
		.bind();

	// 접속 후 RFC 연결
	SapRfcFunction rfc = sap.getRfcFunction("RFC 함수 이름");

	// IMPORT
	rfc.imports().setValue("AAA", "A"); // AAA
	rfc.imports().setValue("BBB", "B"); // BBB
	rfc.imports().setValue("CCC", "C"); // CCC

	JCoTable jcoTable = rfc.importTable("TABLE_NAME");

	if (jcoTable == null) {
		// SAP 내에서 테이블 구현이 안된경우.
		// SAP 제공자에게 테이블 이름과 함께 문의
	}

	// 0행 삽입 예제
	jcoTable.setValue("컬럼이름1", "0번 행의 컬럼 값1 : 자료형을 제공자가 준 것과 같이 맞춰야함!!");
	jcoTable.setValue("컬럼이름2", 3123);

	// 1행 삽입 예제
	jcoTable.appendRow();
	jcoTable.setValue("컬럼이름1", "1번 행의 컬럼 값1");
	jcoTable.setValue("컬럼이름2", 22);

	// 실행
	rfc.execute();

	// EXPORT
	System.out.println(rfc.exports().getValue("DDD"));
	System.out.println(rfc.exports().getValue("EEE"));
	System.out.println(rfc.exports().getValue("FFF"));

	// 테이블 조회
	List<ZSPADEPT_NEW> table1 = rfc.getTable("TABLE_NAME", 클래스매핑.class);
	table1.stream().limit(10).forEach(System.out::println); // 10개만 조회
}
```


# 라이브러리 파일

**아래소스는 예전 버전**
``` java
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoDestinationManager;
import com.sap.conn.jco.JCoException;
import com.sap.conn.jco.JCoFieldIterator;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoTable;

/**
 * SAP RFC 유틸
 * @author		박용서
 * @since		2018. 2. 20.
 */
public class SapManager {

	final static String CONN_FILE_NAME = "SAP";

	// newSapManagerBinder 통해 부르세요.
	SapManager() {
	}

	/** 연결을 시도합니다.
	 * @throws JCoException */
	public SapRfcFunction getRfcFunction(String rfcFunctionName) throws JCoException {
		return new SapRfcFunction(CONN_FILE_NAME, rfcFunctionName);
	}

	/**
	 * 함수를 선언합니다.
	 * @author		박용서
	 * @since		2018. 2. 20.
	 */
	public static class SapRfcFunction {

		final SimpleDateFormat ymdhms = new SimpleDateFormat("yyyyMMddHHmmss");
		final JCoFunction function;
		final JCoDestination destination;
		final String functionName;
		JCoParameterList tables;
		JCoParameterList imports;
		JCoParameterList exports;

		long startTime = 0L;

		// 생성
		private SapRfcFunction(String connectionFileName, String rfcFunctionName) throws JCoException {
			this.functionName = rfcFunctionName;
			destination = JCoDestinationManager.getDestination(connectionFileName);
			function = destination.getRepository().getFunction(rfcFunctionName);
		}

		/**
		 * import 값을 입력합니다.<br>
		 * execute() 이전에 불려야 합니다.
		 * @return JCoParameterList
		 */
		public JCoParameterList imports() {
			if (imports == null) {
				imports = function.getImportParameterList();
			}
			return imports;
		}

		/**
		 * import 할 테이블을 가져옵니다.
		 * @param tableName
		 * @return
		 */
		public JCoTable importTable(String tableName) {
			return function.getTableParameterList().getTable(tableName);
		}

		/**
		 * export 값을 출력합니다.<br>
		 * execute() 이후 불려야합니다.
		 * @return JCoParameterList
		 */
		public JCoParameterList exports() {
			if (exports == null) {
				exports = function.getExportParameterList();
			}
			return exports;
		}

		/**
		 * 실행
		 * @throws JCoException
		 */
		public void execute() throws JCoException {
			/*
			startTime = System.currentTimeMillis();
			final StringBuilder logs = new StringBuilder(1024).append("SAP RFC FUNCTION : ").append(functionName);
			// IMPORT
			logs.append("\n# IMPORT\n - ");
			imports().forEach(e -> logs.append(e.getName()).append(':').append(e.getValue().toString()).append(", "));
			*/
			// 실행
			function.execute(destination);
			/*
			// EXPORT
			logs.append("\n\n# EXPORT\n - ");
			exports().forEach(e -> logs.append(e.getName()).append(':').append(e.getValue().toString()).append(", "));
			logs.append("\n\n");

			// 테이블 목록
			logs.append("\n\n# nTABLE [").append(getTableCount()).append("]");
			tables.forEach(table -> logs.append("\n - ").append(table.getName()).append(" : ").append(table.getTable().getNumRows()));

			// 최종시간
			logs.append("\n\nSAP RFC FUNCTION -- END TIME ").append(System.currentTimeMillis() - startTime);
			//log.info(logs.toString());
			*/
		}

		/**
		 * 테이블 갯수를 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @return
		 */
		public int getTableCount() {
			if (tables == null) {
				tables = function.getTableParameterList();
			}
			return tables.getFieldCount();
		}

		/**
		 * 테이블을 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @param index
		 * @return
		 * @throws Exception
		 */
		public <T> List<T> getTable(int index, final Class<T> T) throws Exception {
			return getTable(index, null, T);
		}

		/**
		 *  테이블을 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @param name
		 * @param T
		 * @return
		 * @throws Exception
		 */
		public <T> List<T> getTable(String name, final Class<T> T) throws Exception {
			return getTable(0, name, T);
		}

		public <T> List<T> getTable(int tableIndex, String tableName, final Class<T> T) throws Exception {

			return getTable(tableIndex, tableName, cols -> {
				Field[] cdo = new Field[cols.length];

				for (int i = 0 ; i < cols.length ; i++) {
					try {
						Field field = T.getDeclaredField(underscoreToCamelcase(cols[i]));
						field.setAccessible(true);
						cdo[i] = field;
					} catch (NoSuchFieldException e) {
						// 필드가 없는것은 무시한다.
					}
				}

				return cdo;
			}, (fields, keys, values) -> {
				T t = T.newInstance();
				for (int i = 0 ; i < fields.length ; i++) {
					Field field = fields[i];
					if (field != null) {
						Object val = values[i];
						if (val != null) {
							switch (val.getClass().getName()) {
								case "java.util.Date" : field.set(t, ymdhms.format((Date)val)); break;
								default : field.set(t, val.toString());
							}
						}
					}
				}
				return t;
			});
		}

		/**
		 * 테이블을 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @param tableIndex tableName가 null 인경우 해당 인덱스의 테이블을 가져옵니다.
		 * @param tableName 테이블을 이름으로 가져옵니다. (우선순위)
		 * @param columnDefiner
		 * @param rowMapper
		 * @return
		 * @throws Exception
		 */
		public <CDO, RC> List<RC> getTable(int tableIndex, String tableName, ColumnDefiner<CDO> columnDefiner, RowMapper<CDO, RC> rowMapper) throws Exception {

			// 체크
			if (getTableCount() <= tableIndex) {
				throw new IllegalArgumentException("out of table index [" + tableIndex + "/" + getTableCount() + "]");
			}

			// 선언
			List<RC> list = new ArrayList<>();
			JCoTable table = tableName != null ? tables.getTable(tableName) : tables.getTable(tableIndex);

			// 로우가 있는지 확인
			if (table != null && table.isFirstRow()) {

				// 필드를 구합니다.
				List<String> columnList = new ArrayList<>();
				JCoFieldIterator columnIterator = table.getFieldIterator();
				while (columnIterator.hasNextField()) {
					columnList.add(columnIterator.nextField().getName());
				}
				String[] columns = columnList.toArray(new String[columnList.size()]);
				int columnLength = columns.length;
				// 컬럼 디파이너를 부릅니다. Column Definer Object
				CDO cdo;
				if (columnDefiner != null) {
					cdo = columnDefiner.call(columns);
				} else {
					cdo = null;
				}

				do {

					int valueIndex = 0;
					Object[] values = new Object[columnLength];
					JCoFieldIterator valueIterator = table.getFieldIterator();

					while (valueIterator.hasNextField()) {
						Object val = valueIterator.nextField().getValue();
						if (val != null && "java.util.Date".equals(val.getClass().getName())) {
							val = ymdhms.format((Date)val);
						}
						values[valueIndex++] = val;
					}

					list.add(rowMapper.call(cdo, columns, values));

				} while (table.nextRow());
			}

			return list;
		}

		/**
		 * 테이블을 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @param index
		 * @return
		 * @throws Exception
		 */
		public List<Map<String, Object>> getTableMap(int index) throws Exception {
			return getTable(index, null, null, (cdo, keys, values) -> {
				Map<String, Object> map = new LinkedHashMap<>();
				for (int i = 0 ; i < keys.length ; i++) {
					map.put(keys[i], values[i]);
				}
				return map;
			});
		}

		/**
		 * 테이블을 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @param index
		 * @return
		 * @throws Exception
		 */
		public List<Map<String, Object>> getTableMap(String name) throws Exception {
			return getTable(0, name, null, (cdo, keys, values) -> {
				Map<String, Object> map = new LinkedHashMap<>();
				for (int i = 0 ; i < keys.length ; i++) {
					map.put(keys[i], values[i]);
				}
				return map;
			});
		}

		/**
		 * 모든 테이블을 맵으로 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @return
		 * @throws Exception
		 */
		public List<List<Map<String, Object>>> getAllTableMapList() throws Exception {
			List<List<Map<String, Object>>> list = new ArrayList<>();
			int tableCount = getTableCount();
			for (int i = 0 ; i < tableCount ; i++) {
				list.add(getTableMap(i));
			}
			return list;
		}

		/**
		 * 모든 테이블을 맵으로 가져옵니다.<br>
		 * execute() 이후에 불려야합니다.
		 * @return
		 * @throws Exception
		 */
		public Map<String, List<Map<String, Object>>> getAllTableMapMap() throws Exception {
			final Map<String, List<Map<String, Object>>> root = new LinkedHashMap<>();
			tables.forEach(table -> {
				try {
					String name = table.getName();
					root.put(name, getTableMap(name));
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
			});
			return root;
		}
	}

	/** 연결을 시도합니다. */
	public static SapManagerBinder newSapManagerBinder() {
		return new SapManagerBinder(new Properties());
	}

	/**
	 * 커넥터 연결
	 * @author		박용서
	 * @since		2018. 2. 20.
	 */
	public static class SapManagerBinder {

		// 환경
		final Properties properties;

		// 내부함수
		SapManagerBinder(Properties properties) {
			this.properties = properties;
		}

		public synchronized SapManager bind() throws JCoException, IOException {
			return bind(false);
		}

		/** 바인드 */
		public synchronized SapManager bind(boolean force) throws JCoException, IOException {
			File connectionFile = new File(CONN_FILE_NAME+".jcoDestination");
			if (force && connectionFile.exists()) {
				connectionFile.delete();
			}
			if (!connectionFile.exists()) {
				FileOutputStream fos = new FileOutputStream(connectionFile, false);
				properties.store(fos, "make connection file");
				fos.close();
			}
			return new SapManager();
		}

		/** 값 세팅 */
		public SapManagerBinder set(String key, String value) {
			properties.setProperty(key, value);
			return this;
		}
	}

	final public static ColumnDefiner<Map<String, Integer>> MAP_COLUMN_DEFINER = (column) -> {
		Map<String, Integer> map = new HashMap<>();
		for (int i = 0 ; i < column.length ; i++) {
			map.put(column[i], i);
		}
		return map;
	};

	/**
	 * 처음 생성된 Column을 보여주는 뷰입니다.
	 * @author		박용서
	 * @since		2018. 2. 20.
	 */
	public static interface ColumnDefiner<CDO> {
		CDO call(String[] rows) throws Exception;
	}

	/**
	 * 행 매핑
	 * @author		박용서
	 * @since		2018. 2. 20.
	 */
	public static interface RowMapper<CDO, RC> {
		RC call(CDO columnDefiner, String[] rows, Object[] values) throws Exception;
	}

	private static String underscoreToCamelcase(String camelcase) {
		if (camelcase == null) {
			return null;
		}
		boolean flag = false;
		char[] under = camelcase.toCharArray();
		char[] camel = new char[under.length];
		int pos = 0;

		for (char c : under) {
			if (c == '_') {
				flag = true;
			} else {
				camel[pos++] = flag ? Character.toUpperCase(c) : Character.toLowerCase(c);
				flag = false;
			}
		}

		return new String(camel, 0 , pos);
	}
}
```